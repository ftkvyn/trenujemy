using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DataCrawler
{
    class Program
    {
        static ChromeDriver pipListDriver = new ChromeDriver();
        static ChromeDriver pipDriver = new ChromeDriver();
        static ChromeDriver tableDriver = new ChromeDriver();

        const string resultFolder = @"C:\Temp\Data\";
        const string removeModalScript = "$('.modal-open').removeClass('modal-open');$('.modal-backdrop').remove();$('.modal').remove();";

        static void Main(string[] args)
        {
            TableLogin();
            List<string> baseCats = new List<string> {
                //"https://www.e-piotripawel.pl/kategoria/artykuly-spozywcze/1106 ",
                //"https://www.e-piotripawel.pl/kategoria/garmazerka-i-gastronomia/955/sort/relevancy.desc",
                //"https://www.e-piotripawel.pl/kategoria/kuchnie-swiata/776/sort/relevancy.desc",
                //"https://www.e-piotripawel.pl/kategoria/mrozonki/20/sort/relevancy.desc",
                //"https://www.e-piotripawel.pl/kategoria/pieczywo-i-wyroby-cukiernicze/26/sort/relevancy.desc",
                "https://www.e-piotripawel.pl/kategoria/ryby-i-przetwory-rybne/32/sort/relevancy.desc",
                //"https://www.e-piotripawel.pl/kategoria/silownia-i-fitness/1108/sort/relevancy.desc",
                //"https://www.e-piotripawel.pl/kategoria/warzywa-i-owoce/41/sort/relevancy.desc",
                //"https://www.e-piotripawel.pl/kategoria/woda-i-napoje/22/sort/relevancy.desc",
                //"https://www.e-piotripawel.pl/kategoria/wedliny-i-mieso/951/sort/relevancy.desc",
                //"https://www.e-piotripawel.pl/kategoria/swieze/1105/sort/relevancy.desc",
            };
            int num = 1;
            foreach(var cat in baseCats)
            {
                var data = ProcessCategory(cat);
                SaveData(data, num++);
            }

            Console.ReadLine();
        }

        static void TableLogin()
        {
            tableDriver.Navigate().GoToUrl("https://www.tabele-kalorii.pl/logowanie.php");
            tableDriver.FindElementById("nazwa_uzytkownika").SendKeys("ftkvyn");
            tableDriver.FindElementById("haslo_uzytkownika").SendKeys("qazxsw");
            tableDriver.FindElement(By.CssSelector("[type=submit]")).Click();
        }

        static List<ProductModel> ProcessCategory(string baseUrl)
        {
            List<ProductModel> data = new List<ProductModel>();
            pipListDriver.Navigate().GoToUrl(baseUrl);
            pipListDriver.ExecuteScript(removeModalScript);
            do
            {
                var links = GetPageLinks();
                foreach (var link in links)
                {
                    var model = GetPipProduct(link);
                    if (!model.InfoFound)
                    {
                        model = FillData(model);
                    }
                    data.Add(model);
                }
                Console.WriteLine($"Page processed, {DateTime.Now}");
            } while (PipListNextPage());
            Console.WriteLine($"Category {baseUrl} processed, {DateTime.Now}");
            return data;
        }

        static bool PipListNextPage()
        {
            var nextLis = pipListDriver.FindElements(By.CssSelector("li.next"));
            if (!nextLis.Any())
            {
                return false;
            }
            else
            {
                var nextPageLink = nextLis.First().FindElement(By.TagName("a")).GetAttribute("href");
                pipListDriver.Navigate().GoToUrl(nextPageLink);
                pipListDriver.ExecuteScript(removeModalScript);
                return true;
            }
        }

        static List<string> GetPageLinks()
        {
            var links = pipListDriver.FindElements(By.CssSelector(".items .product-box .product-box-container h3 a")).Select(el => el.GetAttribute("href"));
            return links.ToList();
        }

        static ProductModel GetPipProduct(string url)
        {
            ProductModel result = new ProductModel();

            try
            {
                pipDriver.Navigate().GoToUrl(url);
                pipDriver.ExecuteScript(removeModalScript);

                result.Title = pipDriver.FindElements(By.CssSelector("[itemprop=name]")).FirstOrDefault()?.Text?.ToLower() ?? "";
                result.PureProductName = result.Title ?? "";
                result.Manufacturer = pipDriver.FindElements(By.CssSelector("[itemprop=brand]")).FirstOrDefault()?.Text?.ToLower();

                var otherInfo = pipDriver.FindElements(By.CssSelector(".other-desc"));
                if (otherInfo.Any())
                {
                    foreach(var element in otherInfo.First().FindElements(By.TagName("h3")))
                    {
                        if(element.Text?.ToLower().Trim() == "marka")
                        {
                            var valueEl = element.FindElement(By.XPath("following-sibling::p"));
                            result.Brand = valueEl?.Text?.ToLower();
                        }

                        try
                        {
                            if (element.Text?.ToLower().Trim() == "wartości odżywcze")
                            {
                                var valuesTable = element.FindElement(By.XPath("following-sibling::table"));
                                var headers = valuesTable.FindElements(By.TagName("tr")).First().FindElements(By.TagName("td"));
                                int neededIndex = 0; bool indexFound = false;
                                for(neededIndex = 0; neededIndex < headers.Count; neededIndex++)
                                {
                                    var headerText = headers[neededIndex]?.Text?.ToLower() ?? "";
                                    if (headerText.Contains("100 g"))
                                    {
                                        indexFound = true;
                                        result.BaseQuantity = "100 g";
                                        break;
                                    }else if(headerText.Contains("100 ml") && !headerText.Contains("%rws"))
                                    {
                                        indexFound = true;
                                        result.BaseQuantity = "100 ml";
                                        break;
                                    }
                                }
                                if (indexFound)
                                {
                                    var trs = valuesTable.FindElements(By.TagName("tr")).ToList();
                                    //skipping first row
                                    for(var i = 1; i < trs.Count; i++)
                                    {
                                        var rowType = trs[i].FindElement(By.TagName("th"))?.Text?.ToLower()?.Trim();
                                        var valueText = trs[i].FindElements(By.TagName("td"))[neededIndex]?.Text?.ToLower()?.Trim();
                                        if (rowType.Contains("wartość energetyczna"))
                                        {
                                            if (valueText.Contains("kj") && valueText.IndexOf("kj") < valueText.IndexOf("kcal"))
                                            {
                                                result.Calories = ExtractSecondNumber(valueText);
                                            }
                                            else
                                            {
                                                result.Calories = ExtractNumber(valueText);
                                            }
                                        }
                                        else if (rowType.StartsWith("tłuszcz"))
                                        {
                                            result.Fat = ExtractNumber(valueText);
                                        }
                                        else if (rowType.StartsWith("węglowodany"))
                                        {
                                            result.Carbo = ExtractNumber(valueText);
                                        }
                                        else if (rowType.StartsWith("białko"))
                                        {
                                            result.Protein = ExtractNumber(valueText);
                                        }
                                    }
                                    result.InfoFound = true;
                                }

                            }
                        }
                        catch(Exception ex)
                        {
                            Console.WriteLine(ex);
                        }
                    }
                }
                if (!String.IsNullOrEmpty(result.Manufacturer))
                {
                    result.PureProductName = result.PureProductName.Replace(result.Manufacturer + " ", "");
                }
                if (!String.IsNullOrEmpty(result.Brand))
                {
                    result.PureProductName = result.PureProductName.Replace(result.Brand + " ", "");
                }

                var categories = pipDriver.FindElements(By.CssSelector(".breadcrumb li"));
                if(categories.Count > 2)
                {
                    result.Category = categories[2]?.Text?.ToLower();
                }
                if (categories.Count > 3)
                {
                    result.SubCategory = categories[3]?.Text?.ToLower();
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            return result;
        }

        static ProductModel FillData(ProductModel model)
        {
            try
            {
                Console.WriteLine($"Looking for values for {model.Title}");
                tableDriver.Navigate().GoToUrl("https://www.tabele-kalorii.pl/");
                var searchInput = tableDriver.FindElementById("wyszukiwarka_produktow");
                searchInput.Clear();
                searchInput.SendKeys(model.PureProductName);
                searchInput.SendKeys(Keys.Enter);

                if (tableDriver.FindElements(By.CssSelector("#komunikat-nie-znaleziono")).Any())
                {
                    searchInput.Clear();
                    searchInput.SendKeys(model.Title);
                    searchInput.SendKeys(Keys.Enter);
                }

                var title = tableDriver.FindElements(By.CssSelector(".tk-nazwa a"))?.FirstOrDefault()?.Text?.ToLower();
                if (!String.IsNullOrEmpty(title))
                {
                    //ToDo: check on .Contains(...)
                    if (title == model.Title || title == model.PureProductName)
                    {
                        Console.WriteLine($"Looking for values for {model.PureProductName}, found {title}");
                        tableDriver.FindElements(By.CssSelector(".tk-nazwa a")).FirstOrDefault().Click();

                        var infoTable = tableDriver.FindElement(By.ClassName("tabela-wo"));
                        var valueType = infoTable.FindElements(By.TagName("tr"))[1]?.FindElements(By.TagName("td"))?[1]?.Text?.ToLower() ?? "";
                        if(valueType.Contains("w 100 g"))
                        {
                            model.BaseQuantity = "100 g";
                        }else if (valueType.Contains("w 100 ml"))
                        {
                            model.BaseQuantity = "100 ml";
                        }
                        else
                        {
                            Console.WriteLine($"Unknown quantity - {valueType}");
                            return model;
                        }

                        var trs = infoTable.FindElements(By.TagName("tr")).ToList();
                        //skipping first two rows
                        for (var i = 2; i < trs.Count; i++)
                        {
                            var rowType = trs[i].FindElements(By.TagName("td"))?.FirstOrDefault()?.Text?.ToLower()?.Trim();
                            var valueText = trs[i].FindElements(By.TagName("td"))?[1]?.Text?.ToLower()?.Trim();                            
                            if (rowType.Contains("wartość energetyczna"))
                            {
                                if(valueText.Contains("kj") && valueText.IndexOf("kj") < valueText.IndexOf("kcal"))
                                {
                                    model.Calories = ExtractSecondNumber(valueText);
                                }
                                else
                                {
                                    model.Calories = ExtractNumber(valueText);
                                }
                                
                            }
                            else
                            {
                                switch (rowType)
                                {
                                    case "tłuszcz":
                                        model.Fat = ExtractNumber(valueText);
                                        break;
                                    case "węglowodany":
                                        model.Carbo = ExtractNumber(valueText);
                                        break;
                                    case "białko":
                                        model.Protein = ExtractNumber(valueText);
                                        break;
                                    default:
                                        //Do nothing
                                        break;
                                }
                            }
                        }
                        model.InfoFound = true;
                    }
                }
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex);
            }
            return model;
        }

        static void SaveData(List<ProductModel> data, int num)
        {
            if (!Directory.Exists(resultFolder))
            {
                Directory.CreateDirectory(resultFolder);
            }
            string resultFileName = $"result_{num}_{DateTime.Now.ToString()}.csv";
            string path = Path.Combine(resultFolder, resultFileName);
            if (File.Exists(path))
            {
                File.Delete(path);
            }
            using (System.IO.StreamWriter output =
            new System.IO.StreamWriter(path))
            {
                foreach(var model in data)
                {
                    output.WriteLine(model.ToString());
                }
            }
        }

        const string numberChars = "1234567890.";

        static double ExtractNumber(string src)
        {
            src = src.Replace(',', '.').Trim();
            var tmp = "";
            var i = 0;
            while (!numberChars.Contains(src[i])) { i++; }
            while (numberChars.Contains(src[i])) { tmp += src[i]; i++; }
            return double.Parse(tmp);
        }

        static double ExtractSecondNumber(string src)
        {
            src = src.Replace(',', '.').Trim();
            var tmp = "";
            var i = 0;
            while (!numberChars.Contains(src[i])) { i++; }
            while (numberChars.Contains(src[i])) { i++; }
            while (!numberChars.Contains(src[i])) { i++; }
            while (numberChars.Contains(src[i])) { tmp += src[i]; i++; }
            return double.Parse(tmp);
        }
    }

    class ProductModel
    {
        public string Title;
        public string PureProductName;
        public string Manufacturer;
        public string Brand;
        public string BaseQuantity;
        public string Category;
        public string SubCategory;
        public double Calories;
        public double Fat;
        public double Carbo;
        public double Protein;

        public bool InfoFound;

        public override string ToString()
        {
            return $"{Title}\t{PureProductName}\t{Manufacturer}\t{Brand}\t{BaseQuantity}\t{Category}\t{SubCategory}\t{Calories}\t{Fat}\t{Carbo}\t{Protein}\t{InfoFound}";
        }
    }
}

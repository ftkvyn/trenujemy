using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataCrawler
{
    class Program
    {
        static ChromeDriver pipDriver = new ChromeDriver();
        //static ChromeDriver tableDriver = new ChromeDriver();

        static void Main(string[] args)
        {
            // var tmpProduct = GetPipProduct("https://www.e-piotripawel.pl/towar/kukurydza-bonduelle-zlocista/13816");
            // Console.WriteLine(tmpProduct);
            // https://www.e-piotripawel.pl/towar/musztarda-kamis-sarepska/231997
            // https://www.e-piotripawel.pl/towar/kukurydza-bonduelle-zlocista/13816
            // https://www.e-piotripawel.pl/towar/napoj-hoop-cola/29477 
            // https://www.e-piotripawel.pl/towar/sok-fortuna-pomaranczowy/226542
            //
            var tmpProduct = GetPipProduct("https://www.e-piotripawel.pl/towar/napoj-hoop-cola/29477");
            Console.WriteLine(tmpProduct);
            tmpProduct = GetPipProduct("https://www.e-piotripawel.pl/towar/sok-fortuna-pomaranczowy/226542");
            Console.WriteLine(tmpProduct);
            Console.ReadLine();
        }

        static List<string> GetPipCategoryLinks(string baseName)
        {
            return null;
        }

        static ProductModel GetPipProduct(string url)
        {
            ProductModel result = new ProductModel();

            try
            {
                pipDriver.Navigate().GoToUrl(url);

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
                                    if (headerText.Contains("w 100 g"))
                                    {
                                        indexFound = true;
                                        result.BaseQuantity = "100 g";
                                        break;
                                    }else if(headerText.Contains("w 100 ml") && !headerText.Contains("%rws"))
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
                                            result.Calories = ExtractSecondNumber(valueText);
                                        }
                                        else
                                        {
                                            switch (rowType)
                                            {
                                                case "tłuszcz":
                                                    result.Fat = ExtractNumber(valueText);
                                                    break;
                                                case "węglowodany":
                                                    result.Carbo = ExtractNumber(valueText);
                                                    break;
                                                case "białko":
                                                    result.Protein = ExtractNumber(valueText);
                                                    break;
                                                default:
                                                    //Do nothing
                                                    break;
                                            }
                                        }
                                    }
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

        public override string ToString()
        {
            return $"{Title}\t{PureProductName}\t{Manufacturer}\t{Brand}\t{BaseQuantity}\t{Category}\t{SubCategory}\t{Calories}\t{Fat}\t{Carbo}\t{Protein}";
        }
    }
}

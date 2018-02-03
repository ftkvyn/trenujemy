function loadTransactions(year, month){
    return new Promise((resolve, reject) => {
        let url = `/api/transactions/${year}/${month}`;
        $.get(url)
        .success(function(data) {
            resolve(data);
        })
        .error(function(err){
            console.error(err);
            reject(err);
        });
      });
}

export { loadTransactions };
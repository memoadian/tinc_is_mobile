export function stringToCurrency(currency: number): string {
    return (currency).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');;
}

export function castCurrency (currency: number): string{
    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      
        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
      });
    return formatter.format(currency)
}

export function getCurrencySettings(gc_currency_cat_name:string){
    let prefix = "$";
    switch (gc_currency_cat_name) {
        case 'BOP':
            prefix = 'Bs ';
            break;
        case 'CRC':
            prefix = '₡ ';
            break;
        case 'SVC':
            prefix = '₡ ';
            break;
        case 'HNL':
            prefix = 'L ';
            break;
        case 'NIO':
            prefix = 'C$ ';
            break;
        case 'PAB':
            prefix = 'B/. ';
            break;
        case 'PYG':
            prefix = '₲ ';
            break;
        case 'PEN':
            prefix = 'S/ ';
            break;
        case 'DOP':
            prefix = 'RD$ ';
            break;
        case 'VEF':
            prefix = 'Bs ';
            break;
        case 'GTQ':
            prefix = 'Q ';
            break;
        case 'HTG':
            prefix = 'G ';
            break;
        default:
            break;
    }
    return prefix ;
  }
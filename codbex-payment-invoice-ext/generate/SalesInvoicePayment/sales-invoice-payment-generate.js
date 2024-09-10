const viewData = {
    id: 'sales-invoice-payment-generate',
    label: 'Generate Sales Invoice Payment',
    link: '/services/web/codbex-payment-invoice-ext/generate/SalesInvoicePayment/generate-sales-invoice-payment.html',
    perspective: 'CustomerPayment',
    view: 'CustomerPayment',
    type: 'entity',
    order: 31
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}
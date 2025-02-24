const viewData = {
    id: 'purchase-invoice-payment-generate',
    label: 'Generate Purchase Invoice Payment',
    link: '/services/web/codbex-payment-invoice-ext/generate/PurchaseInvoicePayment/generate-purchase-invoice-payment.html',
    perspective: 'SupplierPayment',
    view: 'SupplierPayment',
    type: 'entity',
    order: 31
};

if (typeof exports !== 'undefined') {
    exports.getDialogWindow = function () {
        return viewData;
    }
}
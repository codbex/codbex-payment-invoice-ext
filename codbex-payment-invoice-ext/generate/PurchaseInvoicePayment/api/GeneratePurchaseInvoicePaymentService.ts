import { PurchaseInvoiceRepository as PurchaseInvoiceDao } from "codbex-invoices/gen/codbex-invoices/dao/purchaseinvoice/PurchaseInvoiceRepository";
import { SupplierPaymentRepository as SupplierPaymentDao } from "codbex-payments/gen/codbex-payments/dao/SupplierPayment/SupplierPaymentRepository";

import { Controller, Get } from "sdk/http";

@Controller
class GenerateSalesInvoicePaymentService {

    private readonly purchaseInvoiceDao;
    private readonly supplierPaymentDao;

    constructor() {
        this.purchaseInvoiceDao = new PurchaseInvoiceDao();
        this.supplierPaymentDao = new SupplierPaymentDao();
    }

    @Get("/purchaseInvoiceData/:supplierPaymentId")
    public purchaseInvoiceData(_: any, ctx: any) {

        const supplierPaymentId = ctx.pathParameters.supplierPaymentId;
        const supplierPayment = this.supplierPaymentDao.findById(supplierPaymentId);

        const purchaseInvoices = this.purchaseInvoiceDao.findAll({
            $filter: {
                equals: {
                    Supplier: supplierPayment.Supplier
                },
                notEquals: {
                    Status: 6
                }
            }
        });

        return {
            "purchaseInvoices": purchaseInvoices
        };
    }

    @Get("/supplierPayment/:supplierPaymentId")
    public supplierPaymentData(_: any, ctx: any) {

        const supplierPaymentId = ctx.pathParameters.supplierPaymentId;
        const supplierPayment = this.supplierPaymentDao.findById(supplierPaymentId);

        return {
            "Id": supplierPayment.Id,
            "Amount": supplierPayment.Amount
        };
    }

}
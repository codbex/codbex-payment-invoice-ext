import { SalesInvoiceRepository as SalesInvoiceDao } from "../../../../codbex-invoices/gen/codbex-invoices/dao/salesinvoice/SalesInvoiceRepository";
import { CustomerPaymentRepository as CustomerPaymentDao } from "../../../../codbex-payments/gen/codbex-payments/dao/CustomerPayment/CustomerPaymentRepository";

import { Controller, Get } from "sdk/http";

@Controller
class GenerateSalesInvoicePaymentService {

    private readonly salesInvoiceDao;
    private readonly customerPaymentDao;

    constructor() {
        this.salesInvoiceDao = new SalesInvoiceDao();
        this.customerPaymentDao = new CustomerPaymentDao();
    }

    @Get("/salesInvoiceData/:customerPaymentId")
    public salesInvoiceData(_: any, ctx: any) {
        const customerPaymentId = ctx.pathParameters.customerPaymentId;

        let customerPayment = this.customerPaymentDao.findById(customerPaymentId);

        let salesInvoices = this.salesInvoiceDao.findAll({
            $filter: {
                equals: {
                    Customer: customerPayment.Customer
                }
            }
        });

        return {
            "salesInvoices": salesInvoices
        };
    }

    @Get("/customerPayment/:customerPaymentId")
    public customerPaymentData(_: any, ctx: any) {
        const customerPaymentId = ctx.pathParameters.customerPaymentId;

        let customerPayment = this.customerPaymentDao.findById(customerPaymentId);

        return {
            "Id": customerPayment.Id,
            "Amount": customerPayment.Amount
        };
    }

}
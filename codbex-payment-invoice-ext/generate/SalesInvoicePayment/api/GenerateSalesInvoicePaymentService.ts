import { SalesInvoiceRepository as SalesInvoiceDao } from "codbex-invoices/gen/codbex-invoices/dao/salesinvoice/SalesInvoiceRepository";
import { CustomerPaymentRepository as CustomerPaymentDao } from "codbex-payments/gen/codbex-payments/dao/CustomerPayment/CustomerPaymentRepository";
import { SalesInvoicePaymentRepository as SalesInvoicePaymentDao } from "codbex-invoices/gen/codbex-invoices/dao/salesinvoice/SalesInvoicePaymentRepository";

import { Controller, Get } from "sdk/http";

@Controller
class GenerateSalesInvoicePaymentService {

    private readonly salesInvoiceDao;
    private readonly customerPaymentDao;
    private readonly salesInvoicePaymentDao;

    constructor() {
        this.salesInvoiceDao = new SalesInvoiceDao();
        this.customerPaymentDao = new CustomerPaymentDao();
        this.salesInvoicePaymentDao = new SalesInvoicePaymentDao();
    }

    @Get("/salesInvoiceData/:customerPaymentId")
    public salesInvoiceData(_: any, ctx: any) {
        const customerPaymentId = ctx.pathParameters.customerPaymentId;

        const customerPayment = this.customerPaymentDao.findById(customerPaymentId);

        const salesInvoices = this.salesInvoiceDao.findAll({
            $filter: {
                equals: {
                    Customer: customerPayment.Customer
                }
            }
        });

        let notPaidInvoices = [];

        salesInvoices.forEach((invoice) => {

            const salesInvoicePayments = this.salesInvoicePaymentDao.findAll({
                $filter: {
                    equals: {
                        CustomerPayment: customerPayment.Id,
                        SalesInvoice: invoice.Id,
                    }
                }
            });

            if (salesInvoicePayments.length == 0) {
                notPaidInvoices.push(invoice);
            }

        });

        return {
            "salesInvoices": notPaidInvoices
        };
    }

    @Get("/customerPayment/:customerPaymentId")
    public customerPaymentData(_: any, ctx: any) {
        const customerPaymentId = ctx.pathParameters.customerPaymentId;

        const customerPayment = this.customerPaymentDao.findById(customerPaymentId);

        return {
            "Id": customerPayment.Id,
            "Amount": customerPayment.Amount
        };
    }

}
CREATE OR REPLACE FUNCTION public.fc_get_transactionOverview(_id uuid)
    RETURNS TABLE(
     pullPaymentModelID uuid,
     hash varchar,
     typeID integer,
     id uuid,
     title varchar
    )
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE 
AS $BODY$


BEGIN
 RETURN QUERY(
 SELECT
                    pmt."pullPaymentModelID",
                    bct.hash,
                    pms."typeID",
                    pms."id",
                    pms.title
                    FROM
                    public.tb_payments as pmt,
                    public.tb_blockchain_transactions as bct,
                    public.tb_payment_models as pms
                    WHERE
                    pmt."id" = bct."paymentID" and
                    pms."id"=pmt."pullPaymentModelID" and
                    pms."id"=_id
 );

END;

$BODY$;

ALTER FUNCTION public.fc_get_transactionOverview(uuid)
    OWNER TO local_user;
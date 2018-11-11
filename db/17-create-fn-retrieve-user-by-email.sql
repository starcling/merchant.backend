-- FUNCTION: public.fc_get_user_by_email(text)

-- DROP FUNCTION public.fc_get_user_by_email(text);

CREATE OR REPLACE FUNCTION public.fc_get_user_by_email(
	_email text)
    RETURNS tb_users
    LANGUAGE 'plpgsql'

    COST 100
    VOLATILE
AS $BODY$

DECLARE
	tb_users public.tb_users;
BEGIN
	SELECT * FROM public.tb_users WHERE "email" = _email INTO tb_users;


    RETURN tb_users;
END

$BODY$;

ALTER FUNCTION public.fc_get_user_by_email(text)
    OWNER TO local_user;

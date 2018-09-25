INSERT INTO public.tb_payment_model_type("name") VALUES ('push');
INSERT INTO public.tb_payment_model_type("name") VALUES ('singlePull');
INSERT INTO public.tb_payment_model_type("name") VALUES ('recurringPull');
INSERT INTO public.tb_payment_model_type("name") VALUES ('recurringWithInitial');
INSERT INTO public.tb_payment_model_type("name") VALUES ('recurringWithTrial');
INSERT INTO public.tb_payment_model_type("name") VALUES ('recurringWithTrialAndInitial');

INSERT INTO public.tb_payment_status("name") VALUES ('initial');
INSERT INTO public.tb_payment_status("name") VALUES ('running');
INSERT INTO public.tb_payment_status("name") VALUES ('stopped');
INSERT INTO public.tb_payment_status("name") VALUES ('cancelled');
INSERT INTO public.tb_payment_status("name") VALUES ('done');

INSERT INTO public.tb_transaction_type("name") VALUES ('register');
INSERT INTO public.tb_transaction_type("name") VALUES ('initial');
INSERT INTO public.tb_transaction_type("name") VALUES ('execute');
INSERT INTO public.tb_transaction_type("name") VALUES ('cancel');

INSERT INTO public.tb_transaction_status("name") VALUES ('pending');
INSERT INTO public.tb_transaction_status("name") VALUES ('failed');
INSERT INTO public.tb_transaction_status("name") VALUES ('success');
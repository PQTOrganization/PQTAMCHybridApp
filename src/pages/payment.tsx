import { useState } from "react";
import moment from "moment";
import BoxDX from "../components/layout/boxdx";

import usePaymentService from "../shared/services/paymentservice";
import ButtonDX from "../components/controls/buttondx";

const Payment = () => {
  const { getPaymentKey } = usePaymentService();

  const orderId = "PQAMC" + moment().format("yyyyMMddhhmmss");
  const [orderKey, setKey] = useState("");

  const getKey = () => {
    getPaymentKey(orderId).then((key: any) => {
      setKey(key.value);
    });
  };

  return (
    <BoxDX sx={{ p: 2 }}>
      <ButtonDX onClick={getKey}>Get Key</ButtonDX>
      <form
        action="https://staging-ipg.blinq.pk/Payment/PaymentProcess.aspx"
        method="post"
        style={{ textAlign: "center" }}
      >
        <input
          //   type="hidden"
          name="client_id"
          id="client_id"
          value="UMEopMnDkELkxoM"
        />
        <input
          //   type="hidden"
          name="payment_via"
          id="payment_via"
          value="BLINQ_VM"
        />
        <input
          //   type="hidden"
          name="order_id"
          id="order_id"
          value="17022021152609"
        />
        <input
          //   type="hidden"
          name="customer_name"
          id="customer_name"
          value="Abid Zulfiqar"
        />
        <input
          //   type="hidden"
          name="customer_email"
          id="customer_email"
          value="abid.zulfi@domain.com"
        />
        <input
          //   type="hidden"
          name="customer_mobile"
          id="customer_mobile"
          value="03001234567"
        />
        <input
          //   type="hidden"
          name="order_amount"
          id="order_amount"
          value="100.00"
        />
        <input
          //   type="hidden"
          name="order_expiry_date_time"
          id="order_expiry_date_time"
          value="2021-01-01"
        />
        <input
          //   type="hidden"
          name="product_description"
          id="product_description"
          value="TestInvoice"
        />
        <input
          //   type="hidden"
          name="encrypted_form_data"
          id="encrypted_form_data"
          value={orderKey}
        />
        <input
          type="hidden"
          name="return_url"
          id="return_url"
          value="https://localhost:7015/api/payment/response"
        />
        <button type="submit">Post Payment</button>
      </form>
    </BoxDX>
  );
};

export default Payment;

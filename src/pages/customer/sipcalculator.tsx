import React, { useState } from "react";
import ButtonDX from "../../components/controls/buttondx";
import SelectListDX from "../../components/controls/selectlistdx";
import TextFieldDX from "../../components/controls/textfielddx";

import GridDX from "../../components/layout/griddx";
import { formattedNumber, FV } from "../../shared/global";

const SIPCalculator = () => {
  const dataDefault = {
    initInvestment: 100000,
    investAmount: 1000,
    frequency: { id: 12, value: "Monthly" },
    investPeriod: 10,
    annualReturn: 10,
    totalAmount: "",
    futureValue: "",
    weightGain: "",
  };

  const periods = [
    { id: 12, value: "Monthly" },
    { id: 4, value: "Quarterly" },
    { id: 2, value: "Half Yearly" },
    { id: 1, value: "Yearly" },
  ];

  const [data, setData] = useState(dataDefault);
  const [errors, setErrors] = useState<any>({});

  const resetForm = () => {
    setData(dataDefault);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];

    setErrors(newErrors);
    setData({
      ...data,
      [name]: value,
    });
  };

  const handleSelectChange = (value: any, name: string) => {
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);

    setData({ ...data, [name]: value });
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (data.initInvestment < 1)
      newErrors["initInvestment"] = "Initial investment is required";

    if (data.investAmount < 1)
      newErrors["investAmount"] = "Investment amount is required";

    if (data.investPeriod < 1)
      newErrors["investPeriod"] = "Investment period is required";

    if (data.annualReturn < 1)
      newErrors["annualReturn"] = "Annual return is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const generateResult = () => {
    if (validateForm()) {
      const paymentFrequency =
        Number(data.frequency.id) * Number(data.investPeriod);
      const totalAmount =
        paymentFrequency * Number(data.investAmount) +
        Number(data.initInvestment);
      console.log(paymentFrequency, data.initInvestment, totalAmount);
      const futureValue = FV(
        data.annualReturn / 100 / Number(data.frequency.id),
        paymentFrequency,
        -data.investAmount,
        -data.initInvestment,
        1
      );
      const weightGain = futureValue - totalAmount;

      setData({
        ...data,
        totalAmount: formattedNumber(Math.round(totalAmount), 0),
        futureValue: formattedNumber(Math.round(futureValue), 0),
        weightGain: formattedNumber(Math.round(weightGain), 0),
      });
    }
  };

  return (
    <GridDX container sx={{ width: "100%" }} rowSpacing={3}>
      <GridDX item xs={12}>
        <TextFieldDX
          id="initInvestment"
          name="initInvestment"
          label="Initial Investment (PKR)"
          value={data.initInvestment}
          type="numeric"
          onInput={(e: any) => {
            if (e.target.value)
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 9);
          }}
          onChange={handleInputChange}
          error={errors["initInvestment"] ? true : undefined}
          helperText={errors["initInvestment"]}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          id="investAmount"
          name="investAmount"
          label="Investment Amount (PKR)"
          value={data.investAmount}
          type="numeric"
          onInput={(e: any) => {
            if (e.target.value)
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 9);
          }}
          onChange={handleInputChange}
          error={errors["investAmount"] ? true : undefined}
          helperText={errors["investAmount"]}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <SelectListDX
          id="frequency"
          name="frequency"
          label="Payment Frequency"
          list={periods}
          value={data.frequency}
          onChange={(e: any, v: any) => handleSelectChange(v, "frequency")}
          error={errors["frequency"] ? true : undefined}
          helperText={errors["frequency"]}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          id="investPeriod"
          name="investPeriod"
          label="Investment Period (Years)"
          value={data.investPeriod}
          type="numeric"
          onInput={(e: any) => {
            if (e.target.value)
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 2);
          }}
          onChange={handleInputChange}
          error={errors["investPeriod"] ? true : undefined}
          helperText={errors["investPeriod"]}
          required
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          id="annualReturn"
          name="annualReturn"
          label="Expected Annual Return (%)"
          value={data.annualReturn}
          type="numeric"
          onInput={(e: any) => {
            if (e.target.value)
              e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 2);
          }}
          onChange={handleInputChange}
          error={errors["annualReturn"] ? true : undefined}
          helperText={errors["annualReturn"]}
          required
        />
      </GridDX>
      <GridDX item xs={12} justifyContent="space-between" sx={{ py: 2 }}>
        <ButtonDX onClick={generateResult}>Generate Result</ButtonDX>
        <ButtonDX onClick={resetForm} color="success">
          Reset
        </ButtonDX>
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          id="totalAmount"
          name="totalAmount"
          label="Total Invested Amount"
          value={data.totalAmount}
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          id="futureValue"
          name="futureValue"
          label="Future Value"
          value={data.futureValue}
        />
      </GridDX>
      <GridDX item xs={12}>
        <TextFieldDX
          id="weightGain"
          name="weightGain"
          label="Weight Gain"
          value={data.weightGain}
        />
      </GridDX>
    </GridDX>
  );
};

export default SIPCalculator;

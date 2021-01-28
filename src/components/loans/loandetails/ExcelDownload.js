import React from "react";
import ReactExport from "react-data-export";

const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;

function DownloadExcel(props) {
    return (
        <ExcelFile filename={props.excelFile} hideElement={true}>
            <ExcelSheet data={props.data} name="WireDetails">
                <ExcelColumn label="WireID" value="wireID"/>
                <ExcelColumn label="SenderInfoFormatVer" value="senderInfoFormatVer"/>
                <ExcelColumn label="SenderInfoUserReqCorrelation" value="senderInfoUserReqCorrelation"/>
                <ExcelColumn label="SenderInfoTestProdCode" value="senderInfoTestProdCode" />
                <ExcelColumn label="senderInfoDupCode" value="senderInfoDupCode"/>
                <ExcelColumn label="typeCode" value="typeCode" />
                <ExcelColumn label="subtypeCode" value="subtypeCode"/>
                <ExcelColumn label="inputCycleDate" value="inputCycleDate" />
                <ExcelColumn label="inputSource" value="inputSource"/>
                <ExcelColumn label="inputSeqNum" value="inputSeqNum" />
                <ExcelColumn label="amount" value="amount" />
                <ExcelColumn label="senderABANum" value="senderABANum"/>
                <ExcelColumn label="senderShortName" value="senderShortName" />
                <ExcelColumn label="receiverABANum" value="receiverABANum" />
                <ExcelColumn label="receiverShortName" value="receiverShortName"/>
                <ExcelColumn label="businessFunctionCode" value="businessFunctionCode" />
                <ExcelColumn label="transactionTypeCode" value="transactionTypeCode" />
                <ExcelColumn label="senderReference" value="senderReference"/>
                <ExcelColumn label="prevMsgID" value="prevMsgID" />
                <ExcelColumn label="localInstrumentCode" value="localInstrumentCode" />
                <ExcelColumn label="proprietaryCode" value="proprietaryCode"/>
                <ExcelColumn label="paymentNotificationIndicator" value="paymentNotificationIndicator" />
                <ExcelColumn label="paymentContactEAddress" value="paymentContactEAddress" />
                <ExcelColumn label="paymentContactName" value="paymentContactName"/>
                <ExcelColumn label="paymentContactPhone" value="paymentContactPhone" />
                <ExcelColumn label="paymentContactMobile" value="paymentContactMobile" />
                <ExcelColumn label="paymentContactFax" value="paymentContactFax"/>
                <ExcelColumn label="paymentEndToEndID" value="paymentEndToEndID" />
                <ExcelColumn label="detailsOfCharges" value="detailsOfCharges" />
                <ExcelColumn label="sendersChargesCurrency1" value="sendersChargesCurrency1"/>
                <ExcelColumn label="sendersChargesAmount1" value="sendersChargesAmount1" />
                <ExcelColumn label="sendersChargesCurrency2" value="sendersChargesCurrency2" />
                <ExcelColumn label="sendersChargesAmount2" value="sendersChargesAmount2"/>
                <ExcelColumn label="sendersChargesCurrency3" value="sendersChargesCurrency3" />
                <ExcelColumn label="sendersChargesAmount3" value="sendersChargesAmount3" />
                <ExcelColumn label="sendersChargesCurrency4" value="sendersChargesCurrency4"/>
                <ExcelColumn label="sendersChargesAmount4" value="sendersChargesAmount4" />
                <ExcelColumn label="instructedAmountCurrencyCode" value="instructedAmountCurrencyCode"/>
                <ExcelColumn label="instructedAmount" value="instructedAmount" />
                <ExcelColumn label="exchangeRate" value="exchangeRate" />
                <ExcelColumn label="intermediaryFICode" value="intermediaryFICode"/>
                <ExcelColumn label="intermediaryFIIdentifier" value="intermediaryFIIdentifier" />
                <ExcelColumn label="intermediaryFIName" value="intermediaryFIName" />
                <ExcelColumn label="intermediaryFIAddress1" value="intermediaryFIAddress1"/>
                <ExcelColumn label="intermediaryFIAddress2" value="intermediaryFIAddress2" />
                <ExcelColumn label="intermediaryFIAddress3" value="intermediaryFIAddress3" />
                <ExcelColumn label="beneficiaryFICode" value="beneficiaryFICode"/>
                <ExcelColumn label="beneficiaryFIIdentifier" value="beneficiaryFIIdentifier" />
                <ExcelColumn label="beneficiaryFIName" value="beneficiaryFIName" />
                <ExcelColumn label="beneficiaryFIAddress1" value="beneficiaryFIAddress1"/>
                <ExcelColumn label="beneficiaryFIAddress2" value="beneficiaryFIAddress2" />
                <ExcelColumn label="beneficiaryFIAddress3" value="beneficiaryFIAddress3" />
                <ExcelColumn label="beneficiaryCode" value="beneficiaryCode"/>
                <ExcelColumn label="beneficiaryIdentifier" value="beneficiaryIdentifier" />
                <ExcelColumn label="beneficiaryName" value="beneficiaryName" />
                <ExcelColumn label="beneficiaryAddress1" value="beneficiaryAddress1"/>
                <ExcelColumn label="beneficiaryAddress2" value="beneficiaryAddress2" />
                <ExcelColumn label="beneficiaryAddress3" value="beneficiaryAddress3" />
                <ExcelColumn label="referenceForBeneficiary" value="referenceForBeneficiary" />
                <ExcelColumn label="accountDebitedCode" value="accountDebitedCode"/>
                <ExcelColumn label="accountDebitedIdentifier" value="accountDebitedIdentifier" />
                <ExcelColumn label="accountDebitedName" value="accountDebitedName" />
                <ExcelColumn label="accountDebitedAddress1" value="accountDebitedAddress1"/>
                <ExcelColumn label="accountDebitedAddress2" value="accountDebitedAddress2" />
                <ExcelColumn label="accountDebitedAddress3" value="accountDebitedAddress3" />
                <ExcelColumn label="originatorCode" value="originatorCode"/>
                <ExcelColumn label="originatorIdentifier" value="originatorIdentifier" />
                <ExcelColumn label="originatorName" value="originatorName" />
                <ExcelColumn label="originatorAddress1" value="originatorAddress1"/>
                <ExcelColumn label="originatorAddress2" value="originatorAddress2" />
                <ExcelColumn label="originatorAddress3" value="originatorAddress3" />
            </ExcelSheet>
        </ExcelFile>
    );
}

export default DownloadExcel;
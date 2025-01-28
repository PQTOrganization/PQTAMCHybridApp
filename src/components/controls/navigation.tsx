import { useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { AnyCnameRecord } from "dns";

const Navigation = (props: any) => {
  const [isBackLoading, setBackLoading] = useState(false);
  const [isNextLoading, setNextLoading] = useState(false);

  useEffect(() => {
    //setBackLoading(props.loadingIndicator);
    setNextLoading(props.loadingIndicator);
  }, [props.loadingIndicator]);

  const resetNav = () => {
    setBackLoading(false);
    setNextLoading(false);
  };

  // console.log(props, props.disable);
  return (
    <div
      style={{
        marginTop: 20,
        marginBottom: 10,
        display: "flex",
        flexDirection: "row",
        flex: 1,
        justifyContent: "flex-end",
      }}
    >
      {props.onPrevAction && (
        <LoadingButton
          variant="contained"
          loading={isBackLoading}
          onClick={() => {
            setBackLoading(true);
            props.onPrevAction(resetNav);
          }}
          loadingPosition="start"
          style={{ marginRight: 20, width: 125, backgroundColor: "gray" }}
        >
          Back
        </LoadingButton>
      )}

      {props.onNextAction && (
        <LoadingButton
          variant="contained"
          loading={isNextLoading}
          loadingPosition="start"
          style={{ width: 125 }}
          onClick={() => {
            setNextLoading(true);
            props.onNextAction(resetNav);
          }}
          disabled={props.disable === undefined ? false : !props.disable}
        >
          {props.isDeclaration ? "Submit" : "Next"}
        </LoadingButton>
      )}
    </div>
  );
};

export default Navigation;

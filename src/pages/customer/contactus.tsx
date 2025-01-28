import { CardContent, Typography } from "@mui/material";
import CallIcon from "@mui/icons-material/CallOutlined";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import HOIcon from "@mui/icons-material/BusinessOutlined";

import CardDX from "../../components/layout/carddx";
import GridDX from "../../components/layout/griddx";
import { handleCall, handleEmail } from "../../shared/global";

const styles = {
  cardContentStyle: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 280,
  },
  titleStyle: {
    textAlign: "center",
    color: "#007743",
    fontWeight: "bold",
  },
  textStyle: { fontSize: 18, textAlign: "center" },
};

const ContactUs = () => {
  return (
    <GridDX container sx={{ width: "100%" }} spacing={2}>
      <GridDX item sm={12} md={4}>
        <CardDX>
          <CardContent sx={styles.cardContentStyle}>
            <CallIcon fontSize="large" color="success" />
            <br />
            <Typography variant="h5" sx={styles.titleStyle}>
              Call Us
            </Typography>
            <br />
            <Typography sx={styles.textStyle}>
              You can call our helpline at{" "}
              <a
                href="#"
                onClick={() => handleCall("021111772625")}
                style={{ color: "inherit" }}
              >
                <b>(021) 111-PQAMCL (772625)</b>
              </a>{" "}
              from <b>9:00 AM to 5:00 PM (Monday to Friday)</b>
            </Typography>
          </CardContent>
        </CardDX>
      </GridDX>
      <GridDX item sm={12} md={4}>
        <CardDX>
          <CardContent sx={styles.cardContentStyle}>
            <EmailIcon fontSize="large" color="success" />
            <br />
            <Typography variant="h5" sx={styles.titleStyle}>
              Email Us
            </Typography>
            <br />
            <Typography sx={styles.textStyle}>
              You can get in touch with us via e-mail at{" "}
              <a
                href="#"
                onClick={() => handleEmail("info@pqamcl.com")}
                style={{ color: "inherit" }}
              >
                <b>info@pqamcl.com</b>
              </a>{" "}
              and you will be acknowledged within 24 hours with possible closure
              expected. You can also submit an inquiry form
            </Typography>
          </CardContent>
        </CardDX>
      </GridDX>
      <GridDX item sm={12} md={4}>
        <CardDX>
          <CardContent sx={styles.cardContentStyle}>
            <HOIcon fontSize="large" color="success" />
            <br />
            <Typography variant="h5" sx={styles.titleStyle}>
              Head Office
            </Typography>
            <br />
            <Typography sx={styles.textStyle}>
              Suite # G-8/9, Business Arcade, Block-6, P.E.C.H.S., Shara’e
              Faisal, Karachi.
            </Typography>
          </CardContent>
        </CardDX>
      </GridDX>
    </GridDX>
  );
};

export default ContactUs;

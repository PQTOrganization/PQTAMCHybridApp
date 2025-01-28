import { SvgIconProps } from "@mui/material";

export interface ListItemDXProps {
  title: string;
  label: string;
  linkString?: string;
  icon: React.ReactElement<SvgIconProps>;
}

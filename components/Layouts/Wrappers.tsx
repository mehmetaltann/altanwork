import { Box, Container } from "@mui/material";

interface PageWrapperProps {
  children: React.ReactNode;
  conSx?: React.CSSProperties;
  [key: string]: any;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({
  children,
  conSx,
  ...rest
}) => {
  return (
    <Box sx={{ height: "90vh", overflow: "auto" }}>
      <Container
        maxWidth={false}
        sx={{ mt: 2, width: { xs: "100%", xl: "90%" }, ...conSx }}
        {...rest}
      >
        {children}
      </Container>
    </Box>
  );
};

interface DataTableWrapperProps {
  children: React.ReactNode;
  tableHeight: string | number;
  sxProps?: React.CSSProperties;
}

export const DataTableWrapper: React.FC<DataTableWrapperProps> = ({
  children,
  tableHeight,
  sxProps,
}) => {
  return (
    <Box
      sx={{
        height: tableHeight,
        width: "100%",
        ...sxProps,
      }}
    >
      {children}
    </Box>
  );
};

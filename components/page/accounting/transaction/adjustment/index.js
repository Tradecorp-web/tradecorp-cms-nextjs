import {
  Card,
  Grid,
  Icon,
  Link,
  CardContent,
  Typography,
} from "@material-ui/core";

import AccountingBaseLayout from "../../../../base_layout/base-layout-accounting";

export default function Page(props) {
  return (
    <AccountingBaseLayout title="Accounting">
      <div className="p-6 content-wrapper">
        <Grid container spacing={4}>
          <Grid item lg={3}>
            <Link>
              <div className="card card-hover mb-12">
                <h4 className="mb-3">Adjustment Journal</h4>
                <div className="flex-center">
                  <Icon className="me-2" style={{ color: "#666" }}>
                    articlerounded
                  </Icon>
                  <small className="text-muted">Adjustment</small>
                </div>
                <CardContent>
                  <Typography
                    className="mb-12"
                    color="textSecondary"
                    gutterBottom
                  >
                    This page will contain Adjustment Journal
                  </Typography>
                </CardContent>
              </div>
            </Link>
          </Grid>
        </Grid>
      </div>
    </AccountingBaseLayout>
  );
}

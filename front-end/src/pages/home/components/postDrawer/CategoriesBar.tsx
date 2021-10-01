import React, { FC, memo } from "react";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import { makeStyles } from "@material-ui/core/styles";
import { Category } from "../../../../types/postTypes";

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    margin: theme.spacing(2),
  },
}));

type Props = {
  categories: Category[];
};

const CategoriesBar: FC<Props> = ({ categories }) => {
  const classes = useStyles();

  return (
    <Grid
      item
      container
      spacing={1}
      justify="flex-end"
      className={classes.container}
    >
      {categories.map((category) => (
        <Grid item key={category.id}>
          <Chip size="small" color="primary" label={category.name} />
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(CategoriesBar);

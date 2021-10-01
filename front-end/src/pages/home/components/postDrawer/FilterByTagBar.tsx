import React, { FC, useState, useEffect, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@mui/material/Accordion";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import AddCircle from "@material-ui/icons/AddCircle";
import RemoveCircle from "@material-ui/icons/AddCircle";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Category } from "../../../../types/postTypes";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";
import {
  selectAllCategories,
  setFilterTags,
} from "../../../../redux/slices/categoriesSlice";

const useStyles = makeStyles((theme) => ({
  scroll: {
    maxHeight: 150,
    overflowY: "auto",
    marginTop: -theme.spacing(1),
  },
  spacer: {
    marginRight: theme.spacing(1),
  },
}));

const FilterByTagBar: FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const [tagsToShow, setTagsToShow] = useState<Category[]>([]);
  const selectedTags = useAppSelector(
    ({ categories }) => categories.filterTags
  );
  const tags = useAppSelector(selectAllCategories);

  useEffect(() => {
    const newTagsToshow = tags.filter((tag) => !selectedTags.includes(tag));
    setTagsToShow(newTagsToshow);
  }, [tags, selectedTags]);

  const selectTag = (tag: Category): void => {
    const newSelected = selectedTags.slice();
    if (!newSelected.includes(tag)) {
      newSelected.unshift(tag);
    }
    dispatch(setFilterTags(newSelected));
  };

  const deselectTag = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: Category
  ): void => {
    e.stopPropagation();
    const newSelected = selectedTags.filter((t) => t !== tag);
    dispatch(setFilterTags(newSelected));
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container justify="space-between">
          <Grid item>
            <Typography>Filter by tags</Typography>
          </Grid>
          <Grid
            item
            container
            style={{ flex: 1 }}
            justify="flex-end"
            spacing={1}
            className={classes.spacer}
          >
            {selectedTags.map((tag) => (
              <Grid item key={tag.id}>
                <Chip
                  size="small"
                  color="primary"
                  label={tag.name}
                  onClick={(e) => deselectTag(e, tag)}
                  onDelete={(e) => deselectTag(e, tag)}
                  deleteIcon={<RemoveCircle />}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid
          item
          container
          direction="row"
          spacing={1}
          className={classes.scroll}
        >
          {tagsToShow.map((tag) => (
            <Grid item key={tag.id}>
              <Chip
                size="small"
                color="primary"
                label={tag.name}
                onClick={() => selectTag(tag)}
                onDelete={() => selectTag(tag)}
                deleteIcon={<AddCircle />}
              />
            </Grid>
          ))}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(FilterByTagBar);

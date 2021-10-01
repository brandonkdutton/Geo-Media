import React, { FC, useState, useEffect, memo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@mui/material/Accordion";
import Chip from "@material-ui/core/Chip";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import AddCircle from "@material-ui/icons/AddCircle";
import RemoveCircle from "@material-ui/icons/AddCircle";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Chip as PendingChip } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Category } from "../../../../types/postTypes";
import { useAppSelector } from "../../../../redux/hooks";
import { selectAllCategories } from "../../../../redux/slices/categoriesSlice";

const useStyles = makeStyles((theme) => ({
  scroll: {
    maxHeight: 150,
    overflowY: "auto",
  },
  spacer: {
    marginRight: theme.spacing(1),
  },
  divider: {
    marginBottom: theme.spacing(1),
  },
}));

type Props = {
  pendingTag: string;
  selectedTags: Category[];
  selectTag: (tag: Category) => void;
  deselectTag: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    tag: Category
  ) => void;
  setPendingTag: (value: string) => void;
  addPendingTag: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const AssignTabsBar: FC<Props> = ({
  pendingTag,
  selectedTags,
  selectTag,
  deselectTag,
  setPendingTag,
  addPendingTag,
}) => {
  const classes = useStyles();
  const [tagsToShow, setTagsToShow] = useState<Category[]>([]);
  const postPending = useAppSelector(({ posts }) => posts.postPostPending);
  const locCreatePending = useAppSelector(
    ({ locations }) => locations.postCreatePending
  );
  const tags = useAppSelector(selectAllCategories);
  const createPending = useAppSelector(
    ({ categories }) => categories.createPending
  );

  useEffect(() => {
    const newTagsToShow = tags.filter((tag) => !selectedTags.includes(tag));
    setTagsToShow(newTagsToShow);
  }, [tags, selectedTags]);

  return (
    <Accordion disableGutters={true} disabled={postPending || locCreatePending}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid
          container
          justify="space-between"
          spacing={1}
          className={classes.spacer}
        >
          <Grid item>
            <Typography>Assign tags</Typography>
          </Grid>
          <Grid
            item
            container
            style={{ flex: 1 }}
            justify="flex-end"
            spacing={1}
          >
            {pendingTag && (
              <Grid item>
                <Tooltip arrow open={true} title="Tap to add" placement="top">
                  <PendingChip
                    size="small"
                    variant="outlined"
                    disabled={createPending || postPending || locCreatePending}
                    label={pendingTag}
                    onClick={(e) => addPendingTag(e)}
                    onDelete={(e) => addPendingTag(e)}
                    deleteIcon={<AddCircle />}
                  />
                </Tooltip>
              </Grid>
            )}

            {selectedTags.map((tag) => (
              <Grid item key={tag.id}>
                <Chip
                  size="small"
                  color="primary"
                  label={tag.name}
                  disabled={postPending || locCreatePending}
                  onClick={(e) => deselectTag(e, tag)}
                  onDelete={(e) => deselectTag(e, tag)}
                  deleteIcon={<RemoveCircle />}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </AccordionSummary>
      <Divider className={classes.divider} />
      <AccordionDetails>
        <Grid container>
          <Grid
            item
            container
            direction="row"
            spacing={1}
            className={classes.scroll}
          >
            <Grid item>
              <TextField
                size="small"
                disabled={createPending || postPending || locCreatePending}
                placeholder="New tag name"
                value={pendingTag}
                onChange={(e) =>
                  setPendingTag(
                    e.target.value.length < 20 ? e.target.value : pendingTag
                  )
                }
              />
            </Grid>
            {tagsToShow.map((tag) => (
              <Grid item key={tag.id}>
                <Chip
                  size="small"
                  color="primary"
                  label={tag.name}
                  disabled={postPending || locCreatePending}
                  onClick={() => selectTag(tag)}
                  onDelete={() => selectTag(tag)}
                  deleteIcon={<AddCircle />}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export default memo(AssignTabsBar);

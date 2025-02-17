"use client";

import * as React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import { Tag as TagIcon } from "@phosphor-icons/react/dist/ssr/Tag";
import { Plus as PlusIcon } from "@phosphor-icons/react/dist/ssr/Plus";
import { X as CloseIcon } from "@phosphor-icons/react/dist/ssr/X";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";

export default function TagsModal(): React.JSX.Element {
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>(["Organic", "New", "Sale"]); // Example tags
  const [newTag, setNewTag] = React.useState("");
  const [isAdding, setIsAdding] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<string | null>(null);
  const [editedTagValue, setEditedTagValue] = React.useState("");

  const handleTagsOpen = () => setTagsOpen(true);
  const handleTagsClose = () => setTagsOpen(false);

  const handleDeleteTag = (tagToDelete: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToDelete));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setIsAdding(false);
    }
  };

  const handleEditTag = (tag: string) => {
    setEditingTag(tag);
    setEditedTagValue(tag);
  };

  const handleDiscardEdit = () => {
    setEditingTag(null);
    setEditedTagValue('');
  };

  const handleSaveEditedTag = () => {
    if (editedTagValue.trim() === "") {
      handleDeleteTag(editingTag!);
    } else if (!tags.includes(editedTagValue.trim())) {
      setTags((prevTags) =>
        prevTags.map((t) => (t === editingTag ? editedTagValue.trim() : t))
      );
    }
    setEditingTag(null);
  };

  return (
    <>
      <Button
        startIcon={<TagIcon fontSize="var(--icon-fontSize-md)" />}
        variant="contained"
        onClick={handleTagsOpen}
      >
        Tags
      </Button>

      <Dialog open={tagsOpen} onClose={handleTagsClose} fullWidth maxWidth="sm">
        <DialogTitle>Manage Tags</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            {/* Render Tags as Chips */}
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {tags.map((tag) =>
                editingTag === tag ? (
                  <Stack key={tag} direction="row" alignItems="center" spacing={1}>
                    <TextField
                      size="small"
                      variant="outlined"
                      value={editedTagValue}
                      autoFocus
                      onChange={(e) => setEditedTagValue(e.target.value)}
                      onBlur={handleSaveEditedTag}
                      onKeyDown={(e) => e.key === "Enter" && handleSaveEditedTag()}
                    />
                    <IconButton size="small" onClick={handleSaveEditedTag} color="primary">
                      <CheckIcon />
                    </IconButton>
                    <IconButton size="small" onClick={handleDiscardEdit} color="primary">
                      <CloseIcon />
                    </IconButton>
                  </Stack>
                ) : (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleDeleteTag(tag)}
                    onClick={() => handleEditTag(tag)}
                    color="primary"
                    sx={{ cursor: "pointer" }}
                  />
                )
              )}
              {/* Add New Tag Button */}
              {
                !isAdding  ? (
                    <IconButton
                    size="small"
                    color="primary"
                    onClick={() => setIsAdding(true)}
                    sx={{ borderRadius: "50%", border: "1px solid", height: 32, width: 32 }}
                    className={`${editingTag && '!hidden'}`}
                    >
                    <PlusIcon />
                    </IconButton>
                ) : (
                    <Stack direction="row" alignItems="center" spacing={1}>
                    <TextField
                        size="small"
                        variant="outlined"
                        placeholder="New tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
                        autoFocus
                    />
                    <IconButton color="primary" size="small" onClick={handleAddTag}>
                        <CheckIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => setIsAdding(false)}>
                        <CloseIcon />
                    </IconButton>
                    </Stack>
                )
                }
            </Stack>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleTagsClose}>Cancel</Button>
          <Button variant="contained" onClick={handleTagsClose}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

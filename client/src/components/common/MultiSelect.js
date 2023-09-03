import React from "react";
import {
  Box,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
} from "@mui/material";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
    },
  },
};

const getStyles = (name, selectedItems, theme) => {
  return {
    fontWeight:
      selectedItems.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const MultiSelectComponent = ({
  label,
  selectedItems,
  handleChange,
  itemList,
  error,
  helperText,
}) => {
  const theme = useTheme();

  return (
    <FormControl fullWidth sx={{ mt: 1, mb: 3 }} variant="outlined">
      <InputLabel htmlFor={`select-multiple-chip-${label}`} error={error}>
        {label}
      </InputLabel>
      <Select
        multiple
        value={selectedItems}
        onChange={handleChange}
        input={
          <OutlinedInput
            id={`select-multiple-chip-${label}`}
            label={label}
            error={error}
          />
        }
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {itemList.map((item) => (
          <MenuItem
            key={item.value}
            value={item.value}
            style={getStyles(item.value, selectedItems, theme)}
          >
            {item.label}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default MultiSelectComponent;

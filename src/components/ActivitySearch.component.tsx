import { Autocomplete } from "@mui/material";

export default function ActivitySearch() {
    return (
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={top100Films}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Movie" />}
      />
    );
  }
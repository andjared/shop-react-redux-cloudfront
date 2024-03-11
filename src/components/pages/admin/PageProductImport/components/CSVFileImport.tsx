import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import axios from "axios";
import React, { useEffect } from "react";

type CSVFileImportProps = {
  url: string;
  title: string;
};

export default function CSVFileImport({ url, title }: CSVFileImportProps) {
  const [file, setFile] = React.useState<File>();

  useEffect(() => {
    const username = import.meta.env.VITE_USERNAME;
    const password = import.meta.env.VITE_PASSWORD;
    const encodedCredentials = btoa(`${username}:${password}`);
    localStorage.setItem("authorization_token", encodedCredentials);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setFile(file);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const authToken = localStorage.getItem("authorization_token");
  console.log(`Basic ${authToken}`);

  const uploadFile = async () => {
    console.log("uploadFile to", url);

    if (file) {
      const response = await axios({
        method: "GET",
        url,
        params: {
          name: encodeURIComponent(file.name),
        },
        headers: {
          Authorization: `Basic ${authToken}`,
        },
      });

      // Get the presigned URL
      console.log("Uploading to: ", response.data);

      const data = response.data;

      const result = await fetch(data.signedUrl, {
        method: "PUT",
        body: file,
      });

      console.log("Result: ", result);
      setFile(undefined);
    }
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
        <input type="file" onChange={onFileChange} />
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </Box>
  );
}

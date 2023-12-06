import React from 'react'
import { MuiFileInput } from 'mui-file-input'

export default function FichierInput ({label, id, required=false, error=false, callback}){
  const [file, setFile] = React.useState(null)

  const handleChange = (newFile) => {
    setFile(newFile)
  }

  return (
    <MuiFileInput value={file} onChange={callback} label={label} id={id}  required={required} error={error}/>
  )
}
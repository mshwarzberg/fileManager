Param( 
  [String]$Path 
) 
 
Add-Type -AssemblyName Microsoft.VisualBasic 
 
if (-not (Test-Path $Path)) { 
  return -1 
} 
if ((Get-Item $path) -is [System.IO.DirectoryInfo]) { 
   [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($Path,'OnlyErrorDialogs','SendToRecycleBin') 
} else { 
   [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($Path,'OnlyErrorDialogs','SendToRecycleBin') 
} 
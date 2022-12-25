Param( 
  [String]$Path 
) 

Add-Type -AssemblyName Microsoft.VisualBasic
  
$item = Get-Item -Path $Path -ErrorAction SilentlyContinue

$fullpath=$item.FullName
if (Test-Path -Path $fullpath -PathType Container)
{
    [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($fullpath,'OnlyErrorDialogs','SendToRecycleBin')
}
else
{
    [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($fullpath,'OnlyErrorDialogs','SendToRecycleBin')
}


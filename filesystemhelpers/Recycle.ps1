    Param( 
    	[String]$Path 
    ) 
     
    Add-Type -AssemblyName Microsoft.VisualBasic 
     
    try {
      if ((Get-Item $path) -is [System.IO.DirectoryInfo]) { 
         [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($Path,'OnlyErrorDialogs','SendToRecycleBin') 
      } else { 
         [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteFile($Path,'OnlyErrorDialogs','SendToRecycleBin') 
      } 
    }
    catch {
      Write-Output 'Error'
    }
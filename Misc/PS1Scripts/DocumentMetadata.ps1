param(
  [string]$Directory
)
$Shell = New-Object -ComObject Shell.Application

$Array = @()
Get-ChildItem -Path $Directory -Force | ForEach-Object {
  $Folder = $Shell.Namespace($_.DirectoryName)
  $File = $Folder.ParseName($_.Name)
  $Type = $Folder.GetDetailsOf($File, 9)
  $Path = $Directory + $_.Name
  $Size = (Get-Item $Path).length
  if (($Type -eq 'Document') -or ($Type -eq 'Text') -or ($Type -eq 'Unspecified') -and ($Size -lt 10000000)) {
    $Output = Get-Content $Path | Measure-Object -Line -Character -Word
    $Object = @{
      $_.Name = $Output
    }
   $Array += $Object
  }
}
$Array = $Array | ConvertTo-Json
Write-Output $Array
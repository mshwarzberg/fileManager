param(
  [string]$Directory
)
$Shell = New-Object -ComObject Shell.Application

$Array = @()
Get-ChildItem -Path $Directory -Force | ForEach-Object {
  $Folder = $Shell.Namespace($_.DirectoryName)
  $File = $Folder.ParseName($_.Name)
  $type = $Folder.GetDetailsOf($File, 9)
  if (($type -eq 'Document') -or ($type -eq 'Text') -or ($type -eq 'Unspecified')) {
    $Path = $Directory + $_.Name
    $Output = Get-Content $Path | Measure-Object -Line -Character -Word
    $Object = @{
      $_.Name = $Output
    }
   $Array += $Object
  }
}
$Array = $Array | ConvertTo-Json
Write-Output $Array
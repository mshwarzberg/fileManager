param(
  [string]$Directory
)

$Files = (Get-ChildItem -Path $Directory -Recurse -File | Measure-Object).Count
$Folders = (Get-ChildItem -Path $Directory -Recurse -Directory | Measure-Object).Count
$Hidden = (Get-ChildItem -Path $Directory -Recurse -Hidden | Measure-Object).Count
$Size = Get-ChildItem $Directory -Recurse | Measure-Object -Property Length -Sum

$JSON = @{
  'files' = $Files
  'directories'  = $Folders
  'hidden'  = $Hidden
  'combined' = $Files + $Folders + $Hidden
  'size' = $Size
}

$JSON = $JSON | ConvertTo-Json

Write-Output $JSON 
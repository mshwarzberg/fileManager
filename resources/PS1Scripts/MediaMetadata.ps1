param(
  [string]$Directory
)

$Shell = New-Object -ComObject Shell.Application
$Array = @()
Get-ChildItem -Path $Directory -Force | ForEach-Object {
    $Folder = $Shell.Namespace($_.DirectoryName)
    $File = $Folder.ParseName($_.Name)
    $Type = $Folder.GetDetailsOf($File, 9)
      $Duration = $Folder.GetDetailsOf($File, 27)
      $BitRate = $Folder.GetDetailsOf($File, 320)
      if ($Type -eq 'Video') {
        $VideoWidth = $Folder.GetDetailsOf($File, 314)
        $VideoHeight = $Folder.GetDetailsOf($File, 316)
        $Object = @{
          'name' = $_.Name
          'duration' = $Duration
          'width' = $VideoWidth
          'height' = $VideoHeight
          'dimensions' = $VideoWidth + 'x' + $VideoHeight
          'bitrate' = $BitRate
        }
      } elseif ($Type -eq 'Image'){
        $ImageWidth = $Folder.GetDetailsOf($File, 176)
        $ImageHeight = $Folder.GetDetailsOf($File, 178)
        $Description = $Folder.GetDetailsOf($File, 21)
        $Object = @{
          'name' = $_.Name
          'duration' = $Duration
          'width' = $ImageWidth
          'height' = $ImageHeight
          'dimensions' = $ImageWidth + 'x' + $ImageHeight
          'description' = $Description
          'bitrate' = $BitRate
        }
      } else {
        $BitRate = $Folder.GetDetailsOf($File, 28)
        $Object = @{
          'name' = $_.Name
          'bitrate' = $BitRate
          'duration' = $Duration
        }
      }
      $Object = $Object | ConvertTo-Json
      $Array += $Object
    
  }
$Array = $Array | ConvertTo-Json
$Array

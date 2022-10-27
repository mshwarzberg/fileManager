$Source = $args[0]
$Destination = $args[1]
$Mode = $args[2]

if ($Mode -eq 'copy') {
  Copy-Item -Path $Source -Destination $Destination -Recurse
} elseif ($Mode -eq 'move') {
  Move-Item -Path $Source -Destination $Destination
}
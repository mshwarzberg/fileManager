$shell = New-Object -com shell.application
$rb = $shell.Namespace(10)
Function ParseItem {
    [cmdletbinding()]
    Param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [object]$Item
    )
    #this function relies variables set in a parent scope
    Process {
        # uncomment for troubleshooting
        # $global:raw += $item
            #sometimes the original location is stored in an extended property
            $data = $item.ExtendedProperty("infotip").split("`n") | Where-Object { $_ -match "Original location" }
            if ($data) {
                $origPath = $data.split(":", 2)[1].trim()
                $full = Join-Path -path $origPath -ChildPath $item.name -ErrorAction stop
                Remove-Variable -Name data
            }
            else {
                #no extended property so use this code to attemp to rebuild the original location
                if ($item.parent.title -match "^[C-Zc-z]:\\") {
                    $origPath = $item.parent.title
                }
                elseif ($fldpath) {
                    $origPath = $fldPath
                }
                else {
                    # $test = $item.parent
                    # Write-Host "searching for parent on $($test.self.path)" -ForegroundColor cyan
                    # do { $test = $test.parentfolder; $save = $test.title } until ($test.title -match "^[C-Zc-z]:\\" -OR $test.title -eq $save)
                    # $origPath = $test.title
                }

                $full = Join-Path -path $origPath -ChildPath $item.name -ErrorAction stop
            }

           $formattedData = @{
                name             = $item.name
                path             = $item.Path
                displayLocation  = $origPath + '/'
                displayPath      = $full
                size             = $item.Size
                isDirectory      = $item.IsFolder
            }
            $formattedData = $formattedData | ConvertTo-Json
            return $formattedData
    }
}
$bin = $rb.items() | ParseItem
$bin = $bin | ConvertTo-Json
Write-Output $bin
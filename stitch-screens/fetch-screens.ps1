$apiKey = ""
$projectId = "12728606000277993741"
$baseDir = "d:\SISTEMAS\Lifeum Flow\Lifeum Flow Dev\stitch-screens"
$headers = @{ "X-Goog-Api-Key" = $apiKey }

$screens = @(
    @{ id = "asset-stub-assets_0451d8c4df514d9388011a76273d5728"; name = "00-design-system" },
    @{ id = "e86b32c47f504031b17b574178e480e9"; name = "01-tela-inicial-hoje" },
    @{ id = "0fbf594ee67d4158963249340fb449c2"; name = "02-ficha-paciente-resumo" },
    @{ id = "29cb94677fee44379bc6dbfdf6424ac3"; name = "03-ficha-paciente-planejamento" },
    @{ id = "43d380a0df214efcb4349061321d9953"; name = "04-detalhe-area-planejamento" },
    @{ id = "0b14703d66fd444b8bee22b169dd08e1"; name = "05-ficha-paciente-agendamentos" },
    @{ id = "4c4c773c83fe4fe0b4fb6c9d74336d33"; name = "07-ficha-paciente-evolucoes" },
    @{ id = "599389c3308f4835b4b33ccee2981312"; name = "06-novo-editar-agendamento" },
    @{ id = "8421c41018814a56b022afc77204141b"; name = "09-ficha-paciente-arquivos" },
    @{ id = "f207739ce511402783f9b6ed2e8271f6"; name = "08-nova-evolucao-clinica" },
    @{ id = "77a209050e5144b0bb037a872bc19a67"; name = "10-visualizacao-arquivo-exame" },
    @{ id = "82f4061cbf74463aac2dc531c0f934b6"; name = "11-ficha-paciente-historico" },
    @{ id = "c469a409f4434e3a8face887a4baa9d4"; name = "12-ficha-paciente-dados-cadastrais" },
    @{ id = "8161de04fe084386bb8a4900dacd9e6a"; name = "13-pacientes-lista-geral" },
    @{ id = "37806364c8e64c1aa37ef7b5b27834b1"; name = "14-novo-paciente" },
    @{ id = "602d2d8169c445b08561c5d01ff00594"; name = "15-pendencias-proximas-acoes" },
    @{ id = "8805ef63570e4876a68d80ec1aa85727"; name = "16-detalhe-pendencia" },
    @{ id = "0655466bb05445488d50ce83695a5f8a"; name = "17-agenda-geral" },
    @{ id = "2cb38daa068f4f178f1c0bd770e360f7"; name = "18-acoes-rapidas-botao-mais" },
    @{ id = "d18b68a78d7c4475bf6c5f943858b25e"; name = "19-contatos-leads" },
    @{ id = "b692fe65dd1e4a0a96881ed39318c3d6"; name = "20-fluxos" },
    @{ id = "2211dc2c4b784b0eaa3a3060812fec9a"; name = "21-detalhe-fluxo" },
    @{ id = "48cc792d761b435ba90a2eee82b024b0"; name = "22-notificacoes-alertas" },
    @{ id = "9977b392c11747088bb2b55666b91178"; name = "23-menu-mais" },
    @{ id = "d4464be212074309afdab665a838986b"; name = "24-configuracoes" }
)

$total = $screens.Count
$count = 0

foreach ($screen in $screens) {
    $count++
    $screenDir = Join-Path $baseDir $screen.name
    New-Item -ItemType Directory -Force -Path $screenDir | Out-Null
    
    Write-Host "[$count/$total] Buscando: $($screen.name) ..." -ForegroundColor Cyan
    
    try {
        $uri = "https://stitch.googleapis.com/v1/projects/$projectId/screens/$($screen.id)"
        $resp = Invoke-RestMethod -Uri $uri -Headers $headers -Method Get -TimeoutSec 30
        
        # Save full JSON response
        $resp | ConvertTo-Json -Depth 20 | Set-Content -Path (Join-Path $screenDir "screen-data.json") -Encoding UTF8
        
        # Save HTML if available
        if ($resp.html) {
            $resp.html | Set-Content -Path (Join-Path $screenDir "screen.html") -Encoding UTF8
            Write-Host "  -> HTML salvo" -ForegroundColor Green
        }
        
        # Save CSS if available
        if ($resp.css) {
            $resp.css | Set-Content -Path (Join-Path $screenDir "screen.css") -Encoding UTF8
            Write-Host "  -> CSS salvo" -ForegroundColor Green
        }
        
        # Download image if available
        if ($resp.imageUri) {
            $imgPath = Join-Path $screenDir "screen.png"
            Invoke-WebRequest -Uri $resp.imageUri -OutFile $imgPath -TimeoutSec 30
            Write-Host "  -> Imagem salva" -ForegroundColor Green
        }
        elseif ($resp.image -and $resp.image.uri) {
            $imgPath = Join-Path $screenDir "screen.png"
            Invoke-WebRequest -Uri $resp.image.uri -OutFile $imgPath -TimeoutSec 30
            Write-Host "  -> Imagem salva" -ForegroundColor Green
        }
        
        # Save hosted URL if available
        if ($resp.hostedUri) {
            $resp.hostedUri | Set-Content -Path (Join-Path $screenDir "hosted-url.txt") -Encoding UTF8
            Write-Host "  -> URL hospedada: $($resp.hostedUri)" -ForegroundColor Yellow
        }
        
        Write-Host "  -> Dados salvos com sucesso" -ForegroundColor Green
    }
    catch {
        Write-Host "  -> ERRO: $($_.Exception.Message)" -ForegroundColor Red
        $_.Exception.Message | Set-Content -Path (Join-Path $screenDir "error.txt") -Encoding UTF8
    }
    
    # Small delay to avoid rate limiting
    Start-Sleep -Milliseconds 500
}

Write-Host "`n=== Concluído! $count telas processadas ===" -ForegroundColor Green

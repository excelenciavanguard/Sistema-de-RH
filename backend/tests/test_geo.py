from app.geo import grafia_atual, nome_da_rua, semelhanca_de_rua


def test_grafia_antiga_vira_grafia_atual():
    assert grafia_atual("Rua Coronel Goes Pereira") == "rua coronel gois pereira"
    assert grafia_atual("Travessa Theophilo Ottoni") == "travessa teofilo otoni"
    assert grafia_atual("Rua Luiz de Souza") == "rua luis de sousa"
    assert grafia_atual("Rua Ypiranga") == "rua ipiranga"
    assert grafia_atual("Rua dos Leões") == "rua dos leois"   # troca possível; só vale se o mapa confirmar


def test_nome_da_rua_ignora_tipo_de_via_e_acento():
    assert nome_da_rua("R. Coronel Góis Pereira") == "coronel gois pereira"
    assert nome_da_rua("RUAASSUNCAO") == "assuncao"
    assert nome_da_rua("Avenida Rio Branco") == "rio branco"


def test_semelhanca_separa_grafia_parecida_de_outra_rua():
    assert semelhanca_de_rua("Rua Coronel Goes Pereira", "Rua Coronel Góis Pereira") >= 0.85
    assert semelhanca_de_rua("RUAASSUNCAO", "Rua Assunção") >= 0.85
    assert semelhanca_de_rua("Rua Coronel Goes Pereira", "Rua Coronel Polidoro") < 0.85
    assert semelhanca_de_rua("", "Rua Assunção") == 0.0

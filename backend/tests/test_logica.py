import pytest
import datetime
from unittest.mock import Mock
from logica import calcular_vencimiento, validar_titulo
from servicios import ServicioDeTareas

# -- TEST PARAMETRIZADO --
@pytest.mark.parametrize("prioridad,dias_esperados", [
    ("alta", 1),
    ("media", 3),
    ("baja", 7),
    ("otra_cosa", 3)
])
def test_calcular_vencimiento_suma_dias_correctos(prioridad, dias_esperados):
    ahora = datetime.datetime(2026, 1, 1, 12, 0, 0, tzinfo=datetime.timezone.utc)
    vencimiento = calcular_vencimiento(prioridad, ahora)
    
    esperado = ahora + datetime.timedelta(days=dias_esperados)
    assert vencimiento == esperado

# -- CASOS DE ERROR --
@pytest.mark.parametrize("titulo_invalido", ["", "   ", None])
def test_validar_titulo_vacio_es_rechazado(titulo_invalido):
    es_valido, error = validar_titulo(titulo_invalido)
    assert es_valido is False
    assert error == "El título es obligatorio."

def test_validar_titulo_largo_es_rechazado_con_limite():
    titulo_largo = "a" * 101
    es_valido, error = validar_titulo(titulo_largo)
    assert es_valido is False
    assert "100" in error

# -- TEST CON MOCK --
def test_crear_tarea_llama_al_notificador_una_vez():
    # Arrange: Creamos el doble (Mock)
    notificador_mock = Mock()
    servicio = ServicioDeTareas(notificador_mock)
    
    # Act: Ejecutamos la acción
    servicio.crear_tarea_notificada("Comprar pan")
    
    # Assert: Verificamos LA INTERACCIÓN (no el retorno)
    notificador_mock.enviar.assert_called_once_with("Nueva tarea creada: Comprar pan")

from logica import categorizar_tarea

@pytest.mark.parametrize("dias,categoria_esperada", [
    (-1, "vencida"),
    (0, "hoy"),
    (2, "urgente"),
    (5, "normal"),
    (15, "largo plazo"),
    (40, "sin apuro")
])
def test_categorizar_tarea_retorna_categoria_correcta(dias, categoria_esperada):
    assert categorizar_tarea(dias) == categoria_esperada

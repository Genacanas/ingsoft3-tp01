class INotificador:
    def enviar(self, mensaje: str):
        pass

class NotificadorEmail(INotificador):
    def enviar(self, mensaje: str):
        print(f"Enviando email real: {mensaje}")

class ServicioDeTareas:
    def __init__(self, notificador: INotificador):
        self._notificador = notificador

    def crear_tarea_notificada(self, titulo: str):
        # Esta función usa la dependencia externa, ideal para el Mock
        self._notificador.enviar(f"Nueva tarea creada: {titulo}")
        return True

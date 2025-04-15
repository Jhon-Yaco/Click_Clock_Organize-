package vista;

import controlador.ControladorUsuario;
import modelo.UsuarioDAO;
import modelo.Usuario;
import controlador.ConexionBD;
import vista.Interfaz_Usuarios;
import java.util.List;
import javax.swing.table.DefaultTableModel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class Main {
    public static void main(String[] args) {
        // Crear instancia de la vista
        Interfaz_Usuarios vista = new Interfaz_Usuarios();
        
        // Crear instancia del controlador y asociarlo con la vista
        ControladorUsuario controlador = new ControladorUsuario(vista);

      
           

        // Hacer visible la interfaz
        vista.setVisible(true);
    }
}

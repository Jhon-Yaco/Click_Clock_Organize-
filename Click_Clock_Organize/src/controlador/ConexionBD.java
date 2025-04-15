package controlador;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

public class ConexionBD {
    private static ConexionBD instancia;
    private Connection con;

    public ConexionBD(String click_clock_organice, String click_Clock_Organice, String sena_1) {
        String bd = "click_clock_organice";
        String url = "jdbc:mysql://localhost:3306/" + bd + 
                "?useUnicode=true&useJDBCCompliantTimeZoneShift=true&use"
                + "LegacyDatetimeCode=false&serverTimezone=UTC";
        String usuario = "Click_Clock_Organice";
        String pwd = "Sena_1"; // Establece una contraseña segura

        try {
            con = DriverManager.getConnection(url, usuario, pwd);
            System.out.println("Conexion exitosa a la base de datos" + bd);
        } catch (SQLException ex) {
            System.out.println("No se pudo conectar a la base de datos " + bd);
            Logger.getLogger(ConexionBD.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public static ConexionBD getInstancia() {
        if (instancia == null) {
            instancia = new ConexionBD("click_clock_organice", "Click_Clock_Organice", "Sena_1");
        }
        return instancia;
    }

    public Connection getConexion() {
        if (con == null) {
            System.out.println("La conexión no se estableció correctamente");
            return null;
        }
        return con;
    }

    public void cerrarConexion() {
        if (con != null) {
            try {
                con.close();
            } catch (SQLException ex) {
                System.out.println("Error al cerrar la conexión");
            }
        }
    }

    public static void main(String[] args) {
        ConexionBD conexion = ConexionBD.getInstancia();
        
        Connection con = conexion.getConexion();
        // Utiliza la conexión para realizar operaciones en la base de datos
        conexion.cerrarConexion();
    }
}
    




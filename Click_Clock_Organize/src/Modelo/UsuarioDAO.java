package modelo;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import controlador.ConexionBD;

public class UsuarioDAO {
    private Connection conexion;

    public UsuarioDAO(ConexionBD conexionBD) {
        this.conexion = conexionBD.getConexion();
        if (this.conexion == null) {
            System.out.println("Error al obtener la conexión");
        }
    }

    // Método para obtener el próximo ID disponible
    public int obtenerProximoId() {
        String sql = "SELECT MAX(id) FROM usuarios";
        try (Statement stmt = conexion.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            if (rs.next()) {
                return rs.getInt(1) + 1;
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener el próximo ID: " + e.getMessage());
        }
        return 1; // Si no hay usuarios, el primer ID es 1
    }

    // Método CREATE (Insertar un usuario evitando duplicados por correo)
    public void agregarUsuario(Usuario usuario) {
        System.out.println("Intentando registrar usuario: " + usuario.getCorreo()); // Depuración

        String sqlInsert = "INSERT INTO usuarios (id, nombre, correo, contrasena) VALUES (?, ?, ?, ?)";
        String sqlVerificarCorreo = "SELECT 1 FROM usuarios WHERE correo = ?";

        try {
            conexion.setAutoCommit(false);

            // Verificar si el correo ya existe
            try (PreparedStatement stmtVerificar = conexion.prepareStatement(sqlVerificarCorreo)) {
                stmtVerificar.setString(1, usuario.getCorreo());
                try (ResultSet rs = stmtVerificar.executeQuery()) {
                    if (rs.next()) {
                        System.out.println(" Error: El correo ya está registrado.");
                        conexion.rollback();
                        return;
                    }
                }
            }

            // Insertar nuevo usuario
            try (PreparedStatement stmtInsert = conexion.prepareStatement(sqlInsert)) {
                stmtInsert.setInt(1, usuario.getId());
                stmtInsert.setString(2, usuario.getNombre());
                stmtInsert.setString(3, usuario.getCorreo());
                stmtInsert.setString(4, usuario.getContrasena());

                int filasAfectadas = stmtInsert.executeUpdate();
                System.out.println("Usuarios insertados: " + filasAfectadas); // Depuración

                if (filasAfectadas == 1) {
                    conexion.commit();
                    System.out.println(" Usuario agregado correctamente.");
                } else {
                    conexion.rollback();
                    System.out.println(" Error: No se pudo insertar el usuario.");
                }
            }
        } catch (SQLException e) {
            try {
                conexion.rollback();
            } catch (SQLException ex) {
                System.out.println("Error al hacer rollback: " + ex.getMessage());
            }
            System.out.println("Error al agregar usuario: " + e.getMessage());
        } finally {
            try {
                conexion.setAutoCommit(true);
            } catch (SQLException ex) {
                System.out.println("Error al restaurar auto-commit: " + ex.getMessage());
            }
        }
    }

    // Método READ (Obtener todos los usuarios)
    public List<Usuario> obtenerUsuarios() {
        List<Usuario> lista = new ArrayList<>();
        String sql = "SELECT id, nombre, correo, contrasena FROM usuarios";
        try (Statement stmt = conexion.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {
            while (rs.next()) {
                lista.add(new Usuario(rs.getInt("id"), rs.getString("nombre"), rs.getString("correo"), rs.getString("contrasena")));
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener lista de usuarios: " + e.getMessage());
        }
        return lista;
    }

    // Método UPDATE (Actualizar usuario)
    public void actualizarUsuario(Usuario usuario) {
        String sql = "UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ? WHERE id = ?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setString(1, usuario.getNombre());
            stmt.setString(2, usuario.getCorreo());
            stmt.setString(3, usuario.getContrasena());
            stmt.setInt(4, usuario.getId());

            // Verificar si el correo ya existe
            String sqlVerificarCorreo = "SELECT 1 FROM usuarios WHERE correo = ? AND id != ?";
            try (PreparedStatement stmtVerificar = conexion.prepareStatement(sqlVerificarCorreo)) {
                stmtVerificar.setString(1, usuario.getCorreo());
                stmtVerificar.setInt(2, usuario.getId());
                try (ResultSet rs = stmtVerificar.executeQuery()) {
                    if (rs.next()) {
                        System.out.println(" Error: El correo ya está registrado.");
                        return;
                    }
                }
            }

            stmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println("Error al actualizar usuario: " + e.getMessage());
        }
    }

    
// Método para actualizar IDs de usuarios después de eliminar uno
public void actualizarIdsUsuarios(int idEliminado) {
    String sql = "UPDATE usuarios SET id = id - 1 WHERE id > ?";
    try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
        stmt.setInt(1, idEliminado);
        stmt.executeUpdate();
        System.out.println("IDs de usuarios actualizados correctamente.");
    } catch (SQLException e) {
        System.out.println("Error al actualizar IDs de usuarios: " + e.getMessage());
    }
}
    // Método DELETE (Eliminar usuario)
public void eliminarUsuario(int id) {
    String sqlDelete = "DELETE FROM usuarios WHERE id = ?";
    try (PreparedStatement stmt = conexion.prepareStatement(sqlDelete)) {
        stmt.setInt(1, id);
        System.out.println("Intentando eliminar usuario con ID: " + id);
        int filasAfectadas = stmt.executeUpdate();
        System.out.println("Filas afectadas: " + filasAfectadas);
        if (filasAfectadas == 1) {
            System.out.println("Usuario eliminado correctamente.");
            actualizarIdsUsuarios(id); // Actualizar IDs de usuarios
        } else {
            System.out.println("No se encontró el usuario con ID: " + id);
        }
    } catch (SQLException e) {
        System.out.println("Error al eliminar usuario: " + e.getMessage());
    }
}
    
    // Método para verificar si un usuario existe
    public boolean existeUsuario(int id) {
        String sql = "SELECT 1 FROM usuarios WHERE id = ?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setInt(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                return rs.next(); // Si hay resultados, el usuario existe
            }
        } catch (SQLException e) {
            System.out.println("Error al verificar si el usuario existe: " + e.getMessage());
            return false;
        }
    }

    

    // Método para obtener la contraseña de un usuario
    public String getContrasena(int id) {
        List<Usuario> listaUsuarios = obtenerUsuarios();
        for (Usuario usuario : listaUsuarios) {
            if (usuario.getId() == id) {
                return usuario.getContrasena();
            }
        }
        return null;
    }

    // Método para cerrar la conexión
    public void cerrarConexion() {
        try {
            conexion.close();
        } catch (SQLException e) {
            System.out.println("Error al cerrar la conexión: " + e.getMessage());
        }
    }

    // Método para buscar usuarios por nombre o correo
    public List<Usuario> buscarUsuariosPorNombre(String nombre) {
        List<Usuario> lista = new ArrayList<>();
        String sql = "SELECT id, nombre, correo, contrasena FROM usuarios WHERE nombre LIKE ?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setString(1, "%" + nombre + "%");
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    lista.add(new Usuario(rs.getInt("id"), rs.getString("nombre"), rs.getString("correo"), rs.getString("contrasena")));
                }
            }
        } catch (SQLException e) {
            System.out.println("Error al buscar usuarios por nombre: " + e.getMessage());
        }
        return lista;
    }

    // Método para obtener un usuario por correo
    public Usuario getUsuario(String correo) {
        String sql = "SELECT id, nombre, correo, contrasena FROM usuarios WHERE correo = ?";
        try (PreparedStatement stmt = conexion.prepareStatement(sql)) {
            stmt.setString(1, correo);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return new Usuario(rs.getInt("id"), rs.getString("nombre"), rs.getString("correo"), rs.getString("contrasena"));
                }
            }
        } catch (SQLException e) {
            System.out.println("Error al obtener usuario: " + e.getMessage());
        }
        return null;
    }
}
   
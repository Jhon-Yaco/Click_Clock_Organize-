package controlador;

import java.awt.Dimension;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.util.List;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.table.DefaultTableModel;
import modelo.Usuario;
import modelo.UsuarioDAO;
import vista.Interfaz_Usuarios;

public class ControladorUsuario implements ActionListener {
    // Variables Globales
    private int id;
    private String nombre;
    private String correo;
    private String contrasena;

    // Instancias
    ConexionBD conexionBD = ConexionBD.getInstancia();
    UsuarioDAO usuarioDAO = new UsuarioDAO(conexionBD);

    Interfaz_Usuarios vista;
    DefaultTableModel modeloTabla;

    public ControladorUsuario(Interfaz_Usuarios _vista) {
        this.vista = _vista;
        vista.setVisible(true);

        AgregarEventos();
        listarTabla();
    }

    private void AgregarEventos() {
        vista.getBtnGuardar().addActionListener(this);
        vista.getBtnConsultar().addActionListener(this);
        vista.getBtnEditar().addActionListener(this);
        vista.getBtnEliminar().addActionListener(this);
       
        vista.getTblTablaUsuarios().addMouseListener(new MouseAdapter() {
            public void mouseClicked(MouseEvent e) {
                llenarCampos(e);
            }
        });
    }

    private void listarTabla() {
        String[] titulos = new String[]{"ID", "Nombre", "Correo"};
        modeloTabla = new DefaultTableModel(titulos, 0);
        List<Usuario> listaUsuarios = usuarioDAO.obtenerUsuarios();
        modeloTabla.setRowCount(0);

        for (Usuario usuarioIteracion : listaUsuarios) {
            modeloTabla.addRow(new Object[]{
                usuarioIteracion.getId(),
                usuarioIteracion.getNombre(),
                usuarioIteracion.getCorreo(),
            });
        }
        vista.getTblTablaUsuarios().setModel(modeloTabla);
        vista.getTblTablaUsuarios().setPreferredSize(new Dimension(350, modeloTabla.getRowCount() * 16));
    }

    private void llenarCampos(MouseEvent e) {
        JTable target = (JTable) e.getSource();
        id = (int) vista.getTblTablaUsuarios().getModel().getValueAt(target.getSelectedRow(), 0);
        vista.getTxtNombre().setText(vista.getTblTablaUsuarios().getModel().getValueAt(target.getSelectedRow(), 1).toString());
        vista.getTxtCorreo().setText(vista.getTblTablaUsuarios().getModel().getValueAt(target.getSelectedRow(), 2).toString());
        vista.getTxtContrasena().setText(usuarioDAO.getContrasena(id));
    }

    private boolean validarDatos() {
        if ("".equals(vista.getTxtNombre().getText()) ||
            "".equals(vista.getTxtCorreo().getText()) ||
            "".equals(vista.getTxtContrasena().getText())) {
            JOptionPane.showMessageDialog(null, "Los campos no pueden estar vacíos", "Error", JOptionPane.ERROR_MESSAGE);
            return false;
        }
        return true;
    }

    private void guardarUsuario() {
        if (validarDatos()) {
            int id = usuarioDAO.obtenerProximoId();
            Usuario usuario = new Usuario(id, vista.getTxtNombre().getText(), vista.getTxtCorreo().getText(), vista.getTxtContrasena().getText());
            
            try {
                usuarioDAO.agregarUsuario(usuario);
                JOptionPane.showMessageDialog(null, "Usuario agregado con éxito");
                listarTabla();
            } catch (Exception e) {
                System.out.println("Error al agregar usuario: " + e.getMessage());
                JOptionPane.showMessageDialog(null, "Error al agregar usuario: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }
    
    private void editarUsuario() {
        if (validarDatos()) {
            Usuario usuario = new Usuario();
            usuario.setId(id);
            usuario.setNombre(vista.getTxtNombre().getText());
            usuario.setCorreo(vista.getTxtCorreo().getText());
            usuario.setContrasena(vista.getTxtContrasena().getText());
            
            try {
                usuarioDAO.actualizarUsuario(usuario);
                JOptionPane.showMessageDialog(null, "Usuario actualizado con éxito");
                listarTabla();
            } catch (Exception e) {
                System.out.println("Error al actualizar usuario: " + e.getMessage());
                JOptionPane.showMessageDialog(null, "Error al actualizar usuario: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private void eliminarUsuario() {
        System.out.println("Eliminando usuario con ID: " + id);
        if (id != 0) {
            if (usuarioDAO.existeUsuario(id)) {
                int opcion = JOptionPane.showConfirmDialog(null, "¿Está seguro de eliminar el usuario?", "Eliminar usuario", JOptionPane.YES_NO_OPTION);
                if (opcion == JOptionPane.YES_OPTION) {
                    try {
                        usuarioDAO.eliminarUsuario(id);
                                              usuarioDAO.actualizarIdsUsuarios(id); // Actualizar IDs de usuarios
                        JOptionPane.showMessageDialog(null, "Usuario eliminado con éxito");
                        listarTabla();
                    } catch (Exception e) {
                        System.out.println("Error al eliminar usuario: " + e.getMessage());
                        JOptionPane.showMessageDialog(null, "Error al eliminar usuario: " + e.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
                    }
                }
            } else {
                JOptionPane.showMessageDialog(null, "El usuario no existe", "Error", JOptionPane.ERROR_MESSAGE);
            }
        } else {
            JOptionPane.showMessageDialog(null, "Seleccione un usuario para eliminar", "Error", JOptionPane.ERROR_MESSAGE);
        }
    }

    private void consultarUsuario() {
        String textoBuscar = JOptionPane.showInputDialog("Ingrese el correo o nombre del usuario a consultar");
        if (textoBuscar != null && !textoBuscar.isEmpty()) {
            Usuario usuario = usuarioDAO.getUsuario(textoBuscar);
            if (usuario == null) {
                List<Usuario> listaUsuarios = usuarioDAO.buscarUsuariosPorNombre(textoBuscar);
                if (!listaUsuarios.isEmpty()) {
                    usuario = listaUsuarios.get(0);
                }
            }
            if (usuario != null) {
                vista.getTxtNombre().setText(usuario.getNombre());
                vista.getTxtCorreo().setText(usuario.getCorreo());
                vista.getTxtContrasena().setText(usuario.getContrasena());
            } else {
                JOptionPane.showMessageDialog(null, "No se encontró el usuario", "Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == vista.getBtnGuardar()) {
            guardarUsuario();
        } else if (e.getSource() == vista.getBtnConsultar()) {
            consultarUsuario();
        } else if (e.getSource() == vista.getBtnEditar()) {
            editarUsuario();
        } else if (e.getSource() == vista.getBtnEliminar()) {
            eliminarUsuario();
        }
    }
}
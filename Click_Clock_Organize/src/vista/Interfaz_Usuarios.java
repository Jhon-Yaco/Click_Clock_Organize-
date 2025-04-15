package vista;

import modelo.UsuarioDAO;
import modelo.Usuario;
import controlador.ConexionBD;

import java.util.List;
import javax.swing.JButton;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JTable;
import javax.swing.JTextField;
import javax.swing.table.DefaultTableModel;

public class Interfaz_Usuarios extends javax.swing.JFrame {

    // Métodos get
    public JButton getBtnGuardar() {
        return BtnGuardar;
    }

    public JButton getBtnConsultar() {
        return BtnConsultar;
    }

    public JButton getBtnEditar() {
        return BtnEditar;
    }

    public JButton getBtnEliminar() {
        return BtnEliminar;
    }

    public JTable getTblTablaUsuarios() {
        return tblTablaUsuarios;
    }

    public JTextField getTxtNombre() {
        return txtNombre;
    }

    public JTextField getTxtCorreo() {
        return txtCorreo;
    }

    public JTextField getTxtContrasena() {
        return txtContraseña;
    }

    // Constructor
    public Interfaz_Usuarios() {
        initComponents();
    }

    @SuppressWarnings("unchecked")
    private void initComponents() {

        jLabel1 = new javax.swing.JLabel();
        jLabel2 = new javax.swing.JLabel();
        jLabel4 = new javax.swing.JLabel();
        jLabel5 = new javax.swing.JLabel();
        txtCorreo = new javax.swing.JTextField();
        txtContraseña = new javax.swing.JTextField();
        txtNombre = new javax.swing.JTextField();
        BtnConsultar = new javax.swing.JButton();
        icono = new javax.swing.JLabel();
        jButton3 = new javax.swing.JButton();
        BtnEditar = new javax.swing.JButton();
        BtnEliminar = new javax.swing.JButton();
        BtnGuardar = new javax.swing.JButton();
        jLabel6 = new javax.swing.JLabel();
        jScrollPane1 = new javax.swing.JScrollPane();
        tblTablaUsuarios = new javax.swing.JTable();

        setDefaultCloseOperation(javax.swing.WindowConstants.EXIT_ON_CLOSE);
        getContentPane().setLayout(new org.netbeans.lib.awtextra.AbsoluteLayout());

        jLabel1.setFont(new java.awt.Font("Segoe UI", 1, 18)); // NOI18N
        jLabel1.setForeground(new java.awt.Color(0, 51, 102));
        jLabel1.setText("Usuarios ");
        getContentPane().add(jLabel1, new org.netbeans.lib.awtextra.AbsoluteConstraints(190, 250, 90, -1));

        jLabel2.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel2.setText("Contraseña:");
        getContentPane().add(jLabel2, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 180, 90, 20));

        jLabel4.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel4.setText("Nombre:");
        getContentPane().add(jLabel4, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 120, 70, 20));

        jLabel5.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
        jLabel5.setText("Correo:");
        getContentPane().add(jLabel5, new org.netbeans.lib.awtextra.AbsoluteConstraints(130, 150, 60, 20));
        getContentPane().add(txtCorreo, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 150, 140, 20));

        txtContraseña.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                txtContraseñaActionPerformed(evt);
            }
        });
        getContentPane().add(txtContraseña, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 180, 140, 20));
        getContentPane().add(txtNombre, new org.netbeans.lib.awtextra.AbsoluteConstraints(220, 120, 140, 20));

        BtnConsultar.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        BtnConsultar.setText("Consultar");
        BtnConsultar.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                BtnConsultarActionPerformed(evt);
            }
        });
        getContentPane().add(BtnConsultar, new org.netbeans.lib.awtextra.AbsoluteConstraints(150, 450, 90, -1));

        icono.setIcon(new javax.swing.ImageIcon("C:\\Users\\agtes\\OneDrive\\Escritorio\\logo.png")); // NOI18N
        getContentPane().add(icono, new org.netbeans.lib.awtextra.AbsoluteConstraints(180, 10, 90, 70));

        jButton3.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
        jButton3.setText("Iniciar Sesion ");
        jButton3.addActionListener(new java.awt.event.ActionListener() {
            public void actionPerformed(java.awt.event.ActionEvent evt) {
                jButton3ActionPerformed(evt);
            }
        });
        getContentPane().add(jButton3, new org.netbeans.lib.awtextra.AbsoluteConstraints(170, 220, 140, -1));

       BtnEditar.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
BtnEditar.setText("Editar");
BtnEditar.addActionListener(new java.awt.event.ActionListener() {
    public void actionPerformed(java.awt.event.ActionEvent evt) {
        BtnEditarActionPerformed(evt);
    }
});
getContentPane().add(BtnEditar, new org.netbeans.lib.awtextra.AbsoluteConstraints(250, 450, 90, -1));

BtnEliminar.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
BtnEliminar.setText("Eliminar");
BtnEliminar.addActionListener(new java.awt.event.ActionListener() {
    public void actionPerformed(java.awt.event.ActionEvent evt) {
        BtnEliminarActionPerformed(evt);
    }
});
getContentPane().add(BtnEliminar, new org.netbeans.lib.awtextra.AbsoluteConstraints(350, 450, 90, -1));

BtnGuardar.setFont(new java.awt.Font("Segoe UI", 1, 12)); // NOI18N
BtnGuardar.setText("Guardar");
BtnGuardar.addActionListener(new java.awt.event.ActionListener() {
    public void actionPerformed(java.awt.event.ActionEvent evt) {
        BtnGuardarActionPerformed(evt);
    }
});
getContentPane().add(BtnGuardar, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 450, 90, -1));

jLabel6.setFont(new java.awt.Font("Segoe UI", 1, 14)); // NOI18N
jLabel6.setText("Tabla de Usuarios");
getContentPane().add(jLabel6, new org.netbeans.lib.awtextra.AbsoluteConstraints(200, 280, 140, 20));

tblTablaUsuarios.setModel(new javax.swing.table.DefaultTableModel(
    new Object [][] {
        {null, null, null},
        {null, null, null},
        {null, null, null},
        {null, null, null}
    },
    new String [] {
        "Nombre", "Correo", "Contraseña"
    }
));
jScrollPane1.setViewportView(tblTablaUsuarios);

getContentPane().add(jScrollPane1, new org.netbeans.lib.awtextra.AbsoluteConstraints(50, 310, 440, 130));

pack();
    }

    private void txtContraseñaActionPerformed(java.awt.event.ActionEvent evt) {
        // TODO add your handling code here:
    }

    private void BtnConsultarActionPerformed(java.awt.event.ActionEvent evt) {
        // TODO add your handling code here:
    }

    private void jButton3ActionPerformed(java.awt.event.ActionEvent evt) {
        // TODO add your handling code here:
    }

    private void BtnEditarActionPerformed(java.awt.event.ActionEvent evt) {
        // TODO add your handling code here:
    }

    private void BtnEliminarActionPerformed(java.awt.event.ActionEvent evt) {
        // TODO add your handling code here:
    }

    private void BtnGuardarActionPerformed(java.awt.event.ActionEvent evt) {
        // TODO add your handling code here:
    }

    public static void main(String args[]) {
        try {
            for (javax.swing.UIManager.LookAndFeelInfo info : javax.swing.UIManager.getInstalledLookAndFeels()) {
                if ("Nimbus".equals(info.getName())) {
                    javax.swing.UIManager.setLookAndFeel(info.getClassName());
                    break;
                }
            }
        } catch (ClassNotFoundException ex) {
            java.util.logging.Logger.getLogger(Interfaz_Usuarios.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (InstantiationException ex) {
            java.util.logging.Logger.getLogger(Interfaz_Usuarios.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (IllegalAccessException ex) {
            java.util.logging.Logger.getLogger(Interfaz_Usuarios.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        } catch (javax.swing.UnsupportedLookAndFeelException ex) {
            java.util.logging.Logger.getLogger(Interfaz_Usuarios.class.getName()).log(java.util.logging.Level.SEVERE, null, ex);
        }

        java.awt.EventQueue.invokeLater(new Runnable() {
            public void run() {
                new Interfaz_Usuarios().setVisible(true);
            }
        });
    }

    private javax.swing.JButton BtnConsultar;
    private javax.swing.JButton BtnEditar;
    private javax.swing.JButton BtnEliminar;
    private javax.swing.JButton BtnGuardar;
    private javax.swing.JLabel jLabel1;
    private javax.swing.JLabel jLabel2;
    private javax.swing.JLabel jLabel4;
    private javax.swing.JLabel jLabel5;
    private javax.swing.JLabel jLabel6;
    private javax.swing.JScrollPane jScrollPane1;
    private javax.swing.JButton jButton3;
    private javax.swing.JLabel icono;
    private javax.swing.JTable tblTablaUsuarios;
    private javax.swing.JTextField txtContraseña;
    private javax.swing.JTextField txtCorreo;
    private javax.swing.JTextField txtNombre;
}
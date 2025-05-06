package co.edu.unbosque.Trading.service;

import co.edu.unbosque.Trading.model.LoginRequestDTO;
import co.edu.unbosque.Trading.model.User;
import co.edu.unbosque.Trading.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public String register(User nuevoUsuario) {
        if (userRepository.existsByUsername(nuevoUsuario.getUsername())) {
            return "Usuario ya existe";
        }
        nuevoUsuario.setPassword(passwordEncoder.encode(nuevoUsuario.getPassword()));
        userRepository.save(nuevoUsuario);
        return "Usuario registrado correctamente";
    }

    public String login(LoginRequestDTO loginRequest) {
        Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());
        if (user.isPresent()) {
            User usuario = user.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), usuario.getPassword())) {
                return "Inicio de sesión exitoso";
            } else {
                return "Contraseña incorrecta";
            }
        } else {
            return "Usuario no encontrado";
        }
//        //Validar que el rol también coincida
//        if (!user.getRole().equalsIgnoreCase(loginRequest.getRole())) {
//            return "Rol incorrecto";
//        }
    }

}
/*package com.medibridge.authservice.model;

import jakarta.persistence.*;
import lombok.*;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;
    private String fullName;
    private String email;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", referencedColumnName = "id")  // "roles" table has PK "id")
    private Role role;

    // === UserDetails method implementations ===

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = (role != null && role.getName() != null) ? role.getName() : "ROLE_NOT_ASSIGNED";
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    
    public Role getRole() {
        return this.role;
    }

    // Removed the incorrect getRole() method here

}
*/


package com.medibridge.authservice.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")  // Removed schema = "information_schema"
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false,unique = true)
    private String username;

    private String password;

    @Column(name = "full_name")
    private String fullName;

    @Column(name = "email", nullable = true)
    private String email;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "role_id",
        referencedColumnName = "id",
        foreignKey = @ForeignKey(name = "fk_users_role")  // Explicit FK name to avoid conflicts
    )
    private Role role;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        String roleName = (role != null && role.getName() != null) ? role.getName() : "ROLE_NOT_ASSIGNED";
        return List.of(new SimpleGrantedAuthority(roleName));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}


package com.cms.cleaningmanagementsystem.model;

import com.cms.cleaningmanagementsystem.constant.ERole;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Set;

@Document(collection = "roles")
@Data
@AllArgsConstructor
public class Role {
private String id;
private Set<ERole> eRole;
}

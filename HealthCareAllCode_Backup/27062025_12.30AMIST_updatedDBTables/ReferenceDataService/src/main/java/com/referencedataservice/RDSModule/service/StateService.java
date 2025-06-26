package com.referencedataservice.RDSModule.service;

import com.referencedataservice.RDSModule.entity.State;
import com.referencedataservice.RDSModule.repository.StateRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StateService {

    private final StateRepository stateRepository;

    public StateService(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    public List<State> getAllStates() {
        return stateRepository.findAll();
    }

    public List<State> getStatesByCountryId(Long countryId) {
        return stateRepository.findByCountryId(countryId);
    }

    public State getStateById(Long id) {
        return stateRepository.findById(id).orElse(null);
    }

    public State createState(State state) {
        // You might want to validate country presence or set country entity properly here
        return stateRepository.save(state);
    }

    public State updateState(Long id, State newState) {
        Optional<State> existingStateOpt = stateRepository.findById(id);
        if (existingStateOpt.isPresent()) {
            State existingState = existingStateOpt.get();
            existingState.setName(newState.getName());
            existingState.setCode(newState.getCode());
            existingState.setCountry(newState.getCountry());
            return stateRepository.save(existingState);
        }
        return null;
    }

    public boolean deleteState(Long id) {
        Optional<State> existingStateOpt = stateRepository.findById(id);
        if (existingStateOpt.isPresent()) {
            stateRepository.deleteById(id);
            return true;
        }
        return false;
    }
}

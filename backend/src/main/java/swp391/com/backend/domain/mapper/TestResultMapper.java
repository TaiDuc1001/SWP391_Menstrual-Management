package swp391.com.backend.domain.mapper;

import org.apache.commons.lang3.tuple.Pair;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.domain.dto.dto.TestResultListDTO;
import swp391.com.backend.jpa.pojo.examination.ResultDetail;
import swp391.com.backend.jpa.pojo.test.TestType;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface TestResultMapper {
    @Mapping(source = "testType.name", target = "name")
    @Mapping(source = "testType.normalRange", target = "normalRange")
    @Mapping(source = "resultDetail.diagnosis", target = "diagnosis")
    @Mapping(source = "resultDetail.testIndex", target = "testIndex")
    @Mapping(source = "resultDetail.notes", target = "note")
    @Mapping(source = "testType.id", target = "testTypeId")
    TestResultListDTO toDTO(TestType testType, ResultDetail resultDetail);

    // Method to combine two lists
    default List<TestResultListDTO> toTestResultDtoList(List<TestType> testTypes, List<ResultDetail> resultDetails) {
        // Assuming ResultDetail has a testTypeId field to match with TestType's id
        Map<Long, ResultDetail> resultDetailsMap = resultDetails.stream()
                .collect(Collectors.toMap(ResultDetail::getTestTypeId, Function.identity(), (r1, r2) -> r1));

        return testTypes.stream()
                .map(testType -> {
                    ResultDetail matchingResult = resultDetailsMap.get(testType.getId());
                    return toDTO(testType, matchingResult);
                })
                .collect(Collectors.toList());
    }

    // Utility method to split DTOs into entities
    default Pair<List<TestType>, List<ResultDetail>> splitDtoList(List<TestResultListDTO> dtoList) {
        List<TestType> testTypes = new ArrayList<>();
        List<ResultDetail> resultDetails = new ArrayList<>();

        for (TestResultListDTO dto : dtoList) {
            // Build TestType
            TestType testType = new TestType();
            testType.setId(dto.getTestTypeId());
            testType.setName(dto.getName());
            testType.setNormalRange(dto.getNormalRange());
            testTypes.add(testType);

            // Build ResultDetail
            ResultDetail resultDetail = ResultDetail.builder()
                    .testTypeId(dto.getTestTypeId())
                    .diagnosis(dto.getDiagnosis())
                    .testIndex(dto.getTestIndex())
                    .notes(dto.getNote())
                    .build();
            resultDetails.add(resultDetail);
        }

        return Pair.of(testTypes, resultDetails);
    }
}


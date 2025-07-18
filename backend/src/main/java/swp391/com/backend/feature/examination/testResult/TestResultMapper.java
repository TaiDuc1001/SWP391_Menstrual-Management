package swp391.com.backend.feature.examination.testResult;

import org.apache.commons.lang3.tuple.Pair;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import swp391.com.backend.feature.resultDetail.data.ResultDetail;
import swp391.com.backend.feature.testType.data.TestType;

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
    @Mapping(source = "testType.unit", target = "unit")
    TestResultListDTO toDTO(TestType testType, ResultDetail resultDetail);

    
    default List<TestResultListDTO> toTestResultDtoList(List<TestType> testTypes, List<ResultDetail> resultDetails) {
        
        Map<Long, ResultDetail> resultDetailsMap = resultDetails.stream()
                .collect(Collectors.toMap(ResultDetail::getTestTypeId, Function.identity(), (r1, r2) -> r1));

        return testTypes.stream()
                .map(testType -> {
                    ResultDetail matchingResult = resultDetailsMap.get(testType.getId());
                    return toDTO(testType, matchingResult);
                })
                .collect(Collectors.toList());
    }

    
    default Pair<List<TestType>, List<ResultDetail>> splitDtoList(List<TestResultListDTO> dtoList) {
        List<TestType> testTypes = new ArrayList<>();
        List<ResultDetail> resultDetails = new ArrayList<>();

        for (TestResultListDTO dto : dtoList) {
            
            TestType testType = new TestType();
            testType.setId(dto.getTestTypeId());
            testType.setName(dto.getName());
            testType.setNormalRange(dto.getNormalRange());
            testTypes.add(testType);

            
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



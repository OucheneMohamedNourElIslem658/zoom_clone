package utils

import (
	"buf.build/go/protovalidate"
	"google.golang.org/genproto/googleapis/rpc/errdetails"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func ParseValidationError(err *protovalidate.ValidationError) error {
	violations := make([]*errdetails.BadRequest_FieldViolation, 0, len(err.Violations))
	for _, v := range err.Violations {
		message := "unknown validation error"
		if v.Proto.Message != nil {
			message = *v.Proto.Message
		}

		field := ""
		filedElements := v.Proto.Field.Elements
		if len(filedElements) != 0 && filedElements[0].FieldName != nil {
			field = *v.Proto.Field.Elements[0].FieldName
		}

		violations = append(violations, &errdetails.BadRequest_FieldViolation{
			Field:       field,
			Reason:      v.Proto.GetRuleId(),
			Description: message,
		})
	}

	apiErr := status.New(codes.InvalidArgument, "Validation failed for request parameters.")
	
	badRequestDetail := &errdetails.BadRequest{
		FieldViolations: violations,
	}

	st, errWithDetail := apiErr.WithDetails(badRequestDetail)
	if errWithDetail != nil {
		return status.Error(codes.Internal, "validation failed but details could not be attached")
	}

	return st.Err()
}
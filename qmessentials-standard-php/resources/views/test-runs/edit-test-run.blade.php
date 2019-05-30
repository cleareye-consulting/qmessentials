@extends('layouts/app')

@section('title','Edit Test Run')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Edit Test Run</h2>  
    <h3>Lot {{$test_run->lot_number}} &ndash; Item {{$test_run->item_number}} &ndash; {{$test_run->test_plan_name}}</h3>
    <form class="form" action="/test-runs/{{$test_run->test_run_id}}" method="POST">
        {{csrf_field()}}        
        <input type="hidden" id="test_run_id" name="test_run_id" value="{{$test_run->test_run_id}}"/>
        <input type="hidden" name="_method" value="PUT">
        <table class="table">
            <thead>
                <tr>
                    <th>Metric</th>
                    <th>Range</th>
                    <th>Values</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($observations as $observation)
                <tr>
                    <td>{{$observation->metric_name}}{{!($observation->is_nullable) ? '*' : ''}}</td>
                    <td class="observation-criteria">{{$observation->criteria}}</td>
                    <td 
                        data-min-value="{{$observation->min_value}}" 
                        data-is-min-value-inclusive="{{$observation->is_min_value_inclusive ? 'true' : 'false'}}"
                        data-max-value="{{$observation->max_value}}"
                        data-is-max-value-inclusive="{{$observation->is_max_value_inclusive ? 'true' : 'false'}}">
                    @if ($observation->has_multiple_results)
                        <textarea class="form-control observation-results" name="observation-results-{{$observation->observation_id}}">{{implode(' ', $observation_results)}}</textarea>
                    @else
                        <input class="form-control observation-results" name="observation-results-{{$observation->observation_id}}" value="{{count($observation_results) == 1 ? $observation_results[0] : ''}}"/>
                    @endif
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
        <div class="form-group">
            <button class="btn btn-primary">Update Test Run</button>
            <a class="btn btn-default" href="/test-runs">Cancel</a>
        </div>
    </form>
    </div>
@endsection

@section ('scripts')
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script>
        $(() => {            
            $('.observation-results').change(event => {
                const target = $(event.target);
                const values = target.type === 'text' ? [ target.val() ] : target.val().split(' ');
                const parent = target.parents('td');
                const minValue = parent.data('minValue') || Number.MIN_SAFE_INTEGER;
                const isMinValueInclusive = parent.data('isMinValueInclusive');
                const maxValue = parent.data('maxValue') || Number.MAX_SAFE_INTEGER;
                const isMaxValueInclusive = parent.data('isMaxValueInclusive');
                const anyFailing = values.filter(value => {
                    if (isMinValueInclusive === true) {
                        if (+value < minValue) {
                            return true;
                        }
                    }
                    else {
                        if (+value <= minValue) {
                            return true;
                        }
                    }
                    if (isMaxValueInclusive === true) {
                        if (+value > maxValue) {
                            return true;
                        }
                    }
                    else {
                        if (+value >= maxValue) {
                            return true;
                        }
                    }                    
                    return false;                    
                }).length > 0;
                if (anyFailing) {
                    parent.parents('tr').css('color','red');
                    target.css('color','red').css('font-weight','bold');
                }
                else {
                    parent.parents('tr').css('color','green');
                    target.css('color','green').css('font-weight','normal');
                }
            });
        });
    </script>
@endsection

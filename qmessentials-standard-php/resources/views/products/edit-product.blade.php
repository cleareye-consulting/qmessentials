@extends('layouts/app')

@section('title','Edit Product')

@section('content')    
    <div class="container">
    <h2 class="subtitle">Edit Product</h2>  
    <form class="form" action="/products/{{$product->product_id}}" method="POST">
        {{csrf_field()}}
        <input type="hidden" id="product_id" name="product_id" value="{{$product->product_id}}"/>
        <input type="hidden" name="_method" value="PUT">
        <input type="hidden" name="product_test_plan_id_under_edit" value="{{$product_test_plan_id_under_edit}}"/>
        <div class="form-group">
            <label class="control-label" for="product_name">Name</label>
            <input class="form-control" type="text" id="product_name" name="product_name" placeholder="Name" value="{{$product->product_name}}" disabled/>
        </div>
        <table class="table">
            <thead>
                <tr>
                    <th width="70%">Test Plan Name</th>
                    <th width="15%">Required?</th>
                    <td width="15%">&nbsp;</td>
                </tr>
            </thead>
            <tbody>
                @foreach ($product_test_plans as $product_test_plan)
                <tr>
                    @if ($product_test_plan->product_test_plan_id == $product_test_plan_id_under_edit)
                        <td>
                            <select class="form-control" name="edited_product_test_plan_id" id="edited_product_test_plan_id">
                                <option value="0">Select a test plan...</option>
                                @foreach ($test_plans as $test_plan)
                                <option value="{{$test_plan->test_plan_id}}" {{$product_test_plan->test_plan_id == $test_plan->test_plan_id ? 'selected' : ''}}>{{$test_plan->test_plan_name}}</option>
                                @endforeach
                            </select>
                        </td>
                        <td><input type="checkbox" id="edited_product_test_plan_is_required" name="edited_product_test_plan_is_required" {{$product_test_plan->is_required ? 'checked' : ''}}></td>
                        <td><button class="btn btn-sm btn-primary">Update</button></td>
                    @else
                        <td>{{$product_test_plan->test_plan_name}}</td>
                        <td>{{$product_test_plan->is_required ? 'Y' : 'N'}}</td>
                        @if (is_null($product_test_plan_id_under_edit))
                        <td><a class="btn btn-sm btn-outline-primary" href="/products/{{$product->product_id}}/edit/{{$product_test_plan->product_test_plan_id}}">Edit</a></td>
                        @endif
                    @endif
                </tr>
                @endforeach
                @if (is_null($product_test_plan_id_under_edit))
                <tr>
                    <td>
                        <select class="form-control" name="new_product_test_plan_id" id="new_product_test_plan_id">
                            <option value="0">Select a test plan...</option>
                            @foreach ($test_plans as $test_plan)
                            <option value="{{$test_plan->test_plan_id}}">{{$test_plan->test_plan_name}}</option>
                            @endforeach
                        </select>
                    </td>
                    <td><input type="checkbox" id="new_product_test_plan_is_required" name="new_product_test_plan_is_required"></td>
                    <td><button class="btn btn-sm btn-outline-primary">Add</button></td>
                </tr>
                @endif
            </tbody>
        </table>
        </div>
        <div class="form-group">
            <button class="btn btn-primary" disabled>Test Plan Changes Saved Automatically</button>
            <a class="btn btn-outline-secondary" href="/products">Return to List</a>
        </div>
    </form>
    </div>
@endsection